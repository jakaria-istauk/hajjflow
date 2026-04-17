<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class HajjFlow_Admin {

	public static function init() {
		add_action( 'admin_menu',             [ __CLASS__, 'register_menu' ] );
		add_action( 'admin_init',             [ __CLASS__, 'register_settings' ] );
		add_action( 'wp_ajax_hajjflow_gen_sig', [ __CLASS__, 'ajax_gen_sig' ] );
	}

	public static function register_menu() {
		add_submenu_page(
			'edit.php?post_type=hajjflow',
			'HajjFlow Settings',
			'Settings',
			'manage_options',
			'hajjflow-sig',
			[ __CLASS__, 'render_page' ]
		);
	}

	public static function register_settings() {
		register_setting(
			'hajjflow_settings_group',
			'hajjflow_react_origins',
			[
				'type'              => 'array',
				'sanitize_callback' => [ __CLASS__, 'sanitize_origins' ],
				'default'           => [],
			]
		);
	}

	public static function sanitize_origins( $input ) {
		if ( ! is_array( $input ) ) return [];
		return array_values( array_filter( array_map( 'esc_url_raw', $input ) ) );
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

		$tokens  = self::generate();
		$nonce   = wp_create_nonce( 'hajjflow_sig_nonce' );
		$origins = get_option( 'hajjflow_react_origins', [] );
		if ( ! is_array( $origins ) ) $origins = [];
		?>
		<div class="wrap" id="hajjflow-sig-page">
			<h1>HajjFlow — Settings</h1>

			<!-- ── React Origins ─────────────────────────────────────── -->
			<h2>Allowed React Origins (CORS)</h2>
			<p style="color:#666;">
				URLs allowed to access the REST API.
				<code>http://localhost:5173</code> and <code>http://localhost:3000</code> are always allowed in dev.
			</p>
			<form method="post" action="options.php">
				<?php settings_fields( 'hajjflow_settings_group' ); ?>
				<div id="hf-origins-list">
					<?php foreach ( $origins as $url ) : ?>
					<div class="hf-origin-row" style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
						<input
							type="url"
							name="hajjflow_react_origins[]"
							value="<?php echo esc_attr( $url ); ?>"
							placeholder="https://example.com"
							class="regular-text"
							style="width:400px;font-family:monospace;"
						/>
						<button type="button" class="button hf-remove-origin">Remove</button>
					</div>
					<?php endforeach; ?>
				</div>
				<p style="margin-top:8px;">
					<button type="button" class="button" id="hf-add-origin">+ Add Origin</button>
				</p>
				<?php submit_button( 'Save Origins' ); ?>
			</form>

			<!-- ── .env Keys ─────────────────────────────────────────── -->
			<h2 style="margin-top:32px;">.env Keys</h2>
			<p style="color:#666;">Copy these into your React app <code>.env</code> file.</p>
			<table class="widefat" style="max-width:700px;margin-top:8px;">
				<tbody>
					<?php
					$env_fields = [
						'VITE_WP_LOGGED_IN_KEY' => LOGGED_IN_KEY,
						'VITE_WP_AUTH_SALT'     => AUTH_SALT,
					];
					foreach ( $env_fields as $key => $val ) :
					?>
					<tr>
						<th style="width:220px;vertical-align:middle;font-family:monospace;"><?php echo esc_html( $key ); ?></th>
						<td style="vertical-align:middle;">
							<input
								type="password"
								id="hf-env-<?php echo esc_attr( sanitize_key( $key ) ); ?>"
								value="<?php echo esc_attr( $val ); ?>"
								readonly
								style="width:100%;font-family:monospace;font-size:13px;"
							/>
						</td>
						<td style="width:130px;vertical-align:middle;text-align:right;">
							<button class="button hf-toggle-btn" data-target="hf-env-<?php echo esc_attr( sanitize_key( $key ) ); ?>">Show</button>
							<button class="button hf-copy-btn" data-target="hf-env-<?php echo esc_attr( sanitize_key( $key ) ); ?>">Copy</button>
						</td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>

			<!-- ── Signature Tokens ───────────────────────────────────── -->
			<h2 style="margin-top:32px;">App Signature Tokens</h2>
			<p style="color:#666;">
				Valid for <strong>5 minutes</strong>. Use for manual testing with curl/Postman.
			</p>

			<table class="widefat" style="max-width:700px;margin-top:8px;">
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
			var ajaxUrl  = <?php echo wp_json_encode( admin_url( 'admin-ajax.php' ) ); ?>;
			var nonce    = <?php echo wp_json_encode( $nonce ); ?>;
			var restBase = <?php echo wp_json_encode( rest_url( 'hajjflow/v1/' ) ); ?>;

			// ── Repeater ──────────────────────────────────────────────
			function makeOriginRow(val) {
				var row = document.createElement('div');
				row.className = 'hf-origin-row';
				row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
				var inp = document.createElement('input');
				inp.type = 'url';
				inp.name = 'hajjflow_react_origins[]';
				inp.value = val || '';
				inp.placeholder = 'https://example.com';
				inp.className = 'regular-text';
				inp.style.cssText = 'width:400px;font-family:monospace;';
				var btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'button hf-remove-origin';
				btn.textContent = 'Remove';
				btn.addEventListener('click', function(){ row.remove(); });
				row.appendChild(inp);
				row.appendChild(btn);
				return row;
			}

			document.getElementById('hf-add-origin').addEventListener('click', function(){
				document.getElementById('hf-origins-list').appendChild(makeOriginRow(''));
			});

			document.querySelectorAll('.hf-remove-origin').forEach(function(btn){
				btn.addEventListener('click', function(){ btn.closest('.hf-origin-row').remove(); });
			});

			// ── Show/hide toggle ──────────────────────────────────────
			document.querySelectorAll('.hf-toggle-btn').forEach(function(btn){
				btn.addEventListener('click', function(){
					var el = document.getElementById(btn.dataset.target);
					if (el.type === 'password') {
						el.type = 'text';
						btn.textContent = 'Hide';
					} else {
						el.type = 'password';
						btn.textContent = 'Show';
					}
				});
			});

			// ── Copy buttons ──────────────────────────────────────────
			function hfCopy(text, btn) {
				var orig = btn.textContent;
				if (navigator.clipboard && window.isSecureContext) {
					navigator.clipboard.writeText(text).then(function(){
						btn.textContent = 'Copied!';
						setTimeout(function(){ btn.textContent = orig; }, 1500);
					});
				} else {
					var ta = document.createElement('textarea');
					ta.value = text;
					ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
					document.body.appendChild(ta);
					ta.focus();
					ta.select();
					document.execCommand('copy');
					document.body.removeChild(ta);
					btn.textContent = 'Copied!';
					setTimeout(function(){ btn.textContent = orig; }, 1500);
				}
			}

			document.querySelectorAll('.hf-copy-btn').forEach(function(btn){
				btn.addEventListener('click', function(){
					var el = document.getElementById(btn.dataset.target);
					hfCopy(el.value, btn);
				});
			});

			// ── Regenerate ────────────────────────────────────────────
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
