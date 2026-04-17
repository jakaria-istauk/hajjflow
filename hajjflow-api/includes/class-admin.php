<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class HajjFlow_Admin {

	public static function init() {
		add_action( 'admin_menu', [ __CLASS__, 'register_menu' ] );
		add_action( 'wp_ajax_hajjflow_gen_sig', [ __CLASS__, 'ajax_gen_sig' ] );
	}

	public static function register_menu() {
		add_management_page(
			'HajjFlow Signature',
			'HajjFlow Sig',
			'manage_options',
			'hajjflow-sig',
			[ __CLASS__, 'render_page' ]
		);
	}

	// ─── Generate sig set ────────────────────────────────────────────────────
	private static function generate(): array {
		$timestamp = time();
		$nonce     = bin2hex( random_bytes( 16 ) );
		$secret    = LOGGED_IN_KEY . AUTH_SALT;
		$sig       = base64_encode( hash_hmac( 'sha256', $timestamp . ':' . $nonce, $secret, true ) );

		return compact( 'timestamp', 'nonce', 'sig' );
	}

	// ─── AJAX handler ────────────────────────────────────────────────────────
	public static function ajax_gen_sig() {
		check_ajax_referer( 'hajjflow_sig_nonce', 'nonce' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( 'Unauthorized', 403 );
		}
		wp_send_json_success( self::generate() );
	}

	// ─── Admin page ──────────────────────────────────────────────────────────
	public static function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) return;

		$tokens = self::generate();
		$nonce  = wp_create_nonce( 'hajjflow_sig_nonce' );
		?>
		<div class="wrap" id="hajjflow-sig-page">
			<h1>HajjFlow — App Signature Tokens</h1>
			<p style="color:#666;">
				Valid for <strong>5 minutes</strong> from generation.
				Use these headers in your React app or HTTP client.
			</p>

			<table class="widefat" style="max-width:700px;margin-top:16px;">
				<tbody>
					<?php
					$fields = [
						'X-HajjFlow-Timestamp' => $tokens['timestamp'],
						'X-HajjFlow-Nonce'     => $tokens['nonce'],
						'X-HajjFlow-Sig'       => $tokens['sig'],
					];
					foreach ( $fields as $header => $value ) :
					?>
					<tr>
						<th style="width:220px;vertical-align:middle;"><?php echo esc_html( $header ); ?></th>
						<td style="vertical-align:middle;">
							<input
								type="text"
								id="hf-<?php echo esc_attr( sanitize_key( $header ) ); ?>"
								value="<?php echo esc_attr( $value ); ?>"
								readonly
								style="width:100%;font-family:monospace;font-size:13px;"
							/>
						</td>
						<td style="width:80px;vertical-align:middle;text-align:right;">
							<button
								class="button hf-copy-btn"
								data-target="hf-<?php echo esc_attr( sanitize_key( $header ) ); ?>"
							>Copy</button>
						</td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>

			<p style="margin-top:16px;">
				<button id="hf-refresh-btn" class="button button-primary">&#8635; Regenerate</button>
				<span id="hf-status" style="margin-left:12px;color:#2271b1;display:none;">Refreshed.</span>
			</p>

			<h2 style="margin-top:32px;">curl snippet</h2>
			<textarea
				id="hf-curl"
				readonly
				style="width:100%;max-width:700px;height:120px;font-family:monospace;font-size:12px;"
			><?php echo esc_textarea( self::curl_snippet( $tokens ) ); ?></textarea>
			<button class="button hf-copy-btn" data-target="hf-curl" style="margin-top:6px;">Copy curl</button>
		</div>

		<script>
		(function(){
			var ajaxUrl = <?php echo wp_json_encode( admin_url( 'admin-ajax.php' ) ); ?>;
			var nonce   = <?php echo wp_json_encode( $nonce ); ?>;
			var restBase = <?php echo wp_json_encode( rest_url( 'hajjflow/v1/' ) ); ?>;

			// Copy buttons
			document.querySelectorAll('.hf-copy-btn').forEach(function(btn){
				btn.addEventListener('click', function(){
					var el = document.getElementById(btn.dataset.target);
					var txt = el.tagName === 'TEXTAREA' ? el.value : el.value;
					navigator.clipboard.writeText(txt).then(function(){
						var orig = btn.textContent;
						btn.textContent = 'Copied!';
						setTimeout(function(){ btn.textContent = orig; }, 1500);
					});
				});
			});

			// Regenerate
			document.getElementById('hf-refresh-btn').addEventListener('click', function(){
				var btn = this;
				btn.disabled = true;
				fetch(ajaxUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: 'action=hajjflow_gen_sig&nonce=' + encodeURIComponent(nonce),
				})
				.then(function(r){ return r.json(); })
				.then(function(res){
					if (!res.success) { alert('Error regenerating.'); return; }
					var d = res.data;
					var map = {
						'hf-x-hajjflow-timestamp': d.timestamp,
						'hf-x-hajjflow-nonce':     d.nonce,
						'hf-x-hajjflow-sig':       d.sig,
					};
					Object.keys(map).forEach(function(id){
						var el = document.getElementById(id);
						if (el) el.value = map[id];
					});
					// Update curl
					document.getElementById('hf-curl').value =
						'curl -X GET "' + restBase + 'YOUR_ENDPOINT" \\\n' +
						'  -H "X-HajjFlow-Timestamp: ' + d.timestamp + '" \\\n' +
						'  -H "X-HajjFlow-Nonce: ' + d.nonce + '" \\\n' +
						'  -H "X-HajjFlow-Sig: ' + d.sig + '"';
					var status = document.getElementById('hf-status');
					status.style.display = 'inline';
					setTimeout(function(){ status.style.display = 'none'; }, 2000);
				})
				.finally(function(){ btn.disabled = false; });
			});
		})();
		</script>
		<?php
	}

	private static function curl_snippet( array $t ): string {
		$base = rest_url( 'hajjflow/v1/YOUR_ENDPOINT' );
		return 'curl -X GET "' . $base . '" \\' . "\n"
			. '  -H "X-HajjFlow-Timestamp: ' . $t['timestamp'] . '" \\' . "\n"
			. '  -H "X-HajjFlow-Nonce: ' . $t['nonce'] . '" \\' . "\n"
			. '  -H "X-HajjFlow-Sig: ' . $t['sig'] . '"';
	}
}
