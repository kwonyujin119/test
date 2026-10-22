package com.sachil47.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.DownloadManager
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.provider.Settings
import android.util.Base64
import android.webkit.GeolocationPermissions
import android.webkit.JavascriptInterface
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import java.io.File

/** SACHIL:47 앱 — 웹앱(github.io)을 그대로 띄우고, 초과근무 알람만 휴대폰 알람(Ot)으로 맡긴다 */
class MainActivity : Activity() {
    companion object { const val APP_URL = "https://kwonyujin119.github.io/test/" }

    private lateinit var web: WebView
    private var fileCb: ValueCallback<Array<Uri>>? = null
    private var geoCb: GeolocationPermissions.Callback? = null
    private var geoOrigin: String? = null

    private val evRx = object : BroadcastReceiver() {
        override fun onReceive(c: Context, i: Intent) { syncWeb() }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        web = WebView(this)
        setContentView(web)
        with(web.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            setGeolocationEnabled(true)
            userAgentString = userAgentString + " SACHIL47App/1"
        }
        web.addJavascriptInterface(Bridge(), "SachilNative")
        web.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(v: WebView, r: WebResourceRequest): Boolean {
                val u = r.url
                if (u.scheme == "http" || u.scheme == "https") {
                    val host = u.host ?: ""
                    if (host.endsWith("github.io") || host.endsWith("sachil47.com")) return false
                    return openOut(Intent(Intent.ACTION_VIEW, u))   // YouTube·카카오 등 바깥 주소는 그 앱/브라우저로
                }
                return try { openOut(Intent.parseUri(u.toString(), Intent.URI_INTENT_SCHEME)) } catch (_: Exception) { true }
            }
        }
        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(v: WebView, cb: ValueCallback<Array<Uri>>, p: FileChooserParams): Boolean {
                fileCb?.onReceiveValue(null); fileCb = cb
                return try { startActivityForResult(p.createIntent().putExtra(Intent.EXTRA_ALLOW_MULTIPLE, p.mode == FileChooserParams.MODE_OPEN_MULTIPLE), 41); true }
                catch (_: Exception) { fileCb = null; false }
            }
            override fun onGeolocationPermissionsShowPrompt(origin: String, cb: GeolocationPermissions.Callback) {
                if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) cb.invoke(origin, true, false)
                else { geoCb = cb; geoOrigin = origin
                    requestPermissions(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION), 42) }
            }
        }
        web.setDownloadListener { url, _, disp, mime, _ ->
            if (url.startsWith("blob:")) {   // 앱 안에서 만든 파일(사진 저장·보고서·캘린더 등) — 내용을 받아 다운로드 폴더에 저장
                web.evaluateJavascript("""(async()=>{try{const b=await (await fetch('$url')).blob();const r=new FileReader();r.onload=()=>SachilNative.saveBase64(window.__lastDlName||'',b.type,String(r.result).split(',')[1]);r.readAsDataURL(b);}catch(e){}})()""", null)
            } else {
                try {
                    val name = URLUtil.guessFileName(url, disp, mime)
                    val rq = DownloadManager.Request(Uri.parse(url)).setMimeType(mime).setTitle(name)
                        .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                        .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name)
                    getSystemService(DownloadManager::class.java).enqueue(rq)
                    Toast.makeText(this, "내려받는 중 — $name", Toast.LENGTH_SHORT).show()
                } catch (_: Exception) { openOut(Intent(Intent.ACTION_VIEW, Uri.parse(url))) }
            }
        }
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 43)
        Ot.ensureChannel(this)
        if (b == null) web.loadUrl(APP_URL) else web.restoreState(b)
    }

    private fun openOut(i: Intent): Boolean {
        try { startActivity(i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) } catch (_: Exception) { }
        return true
    }

    private fun syncWeb() { runOnUiThread { web.evaluateJavascript("window.__otNativeSync&&window.__otNativeSync()", null) } }

    override fun onResume() {
        super.onResume()
        val f = IntentFilter("com.sachil47.app.OT_EVENT")
        if (Build.VERSION.SDK_INT >= 33) registerReceiver(evRx, f, Context.RECEIVER_NOT_EXPORTED) else registerReceiver(evRx, f)
        syncWeb()
    }

    override fun onPause() { super.onPause(); try { unregisterReceiver(evRx) } catch (_: Exception) { } }

    override fun onSaveInstanceState(o: Bundle) { super.onSaveInstanceState(o); web.saveState(o) }

    @Deprecated("WebView 뒤로")
    override fun onBackPressed() { if (web.canGoBack()) web.goBack() else super.onBackPressed() }

    @Deprecated("파일 선택 결과")
    override fun onActivityResult(req: Int, res: Int, data: Intent?) {
        super.onActivityResult(req, res, data)
        if (req == 41) {
            val multi = if (res == RESULT_OK) data?.clipData?.let { cd -> Array(cd.itemCount) { cd.getItemAt(it).uri } } else null
            fileCb?.onReceiveValue(multi ?: WebChromeClient.FileChooserParams.parseResult(res, data)); fileCb = null
        }
    }

    override fun onRequestPermissionsResult(req: Int, perms: Array<out String>, res: IntArray) {
        super.onRequestPermissionsResult(req, perms, res)
        if (req == 42) { geoCb?.invoke(geoOrigin, res.isNotEmpty() && res[0] == PackageManager.PERMISSION_GRANTED, false); geoCb = null }
    }

    /** 웹앱에서 부르는 기능: window.SachilNative */
    inner class Bridge {
        @JavascriptInterface fun isNative(): Boolean = true
        @JavascriptInterface fun schedule(due: String, iv: Int) { due.toLongOrNull()?.let { Ot.schedule(this@MainActivity, it, iv) } }
        @JavascriptInterface fun cancel() { Ot.cancel(this@MainActivity) }
        @JavascriptInterface fun takeEvents(): String = Ot.takeEvents(this@MainActivity)
        @JavascriptInterface fun canOverlay(): Boolean = Settings.canDrawOverlays(this@MainActivity)
        @JavascriptInterface fun requestOverlay() {
            runOnUiThread { openOut(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))) }
        }
        @JavascriptInterface fun canFullScreen(): Boolean =
            Build.VERSION.SDK_INT < 34 || getSystemService(NotificationManager::class.java).canUseFullScreenIntent()
        @JavascriptInterface fun requestFullScreen() {
            if (Build.VERSION.SDK_INT >= 34) runOnUiThread { openOut(Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT, Uri.parse("package:$packageName"))) }
        }
        @JavascriptInterface fun testAlarm(sec: Int) {   // 'n초 후 테스트' — 진짜 알람과 같은 길로
            Ot.schedule(this@MainActivity, System.currentTimeMillis() + sec * 1000L, Ot.ivMin(this@MainActivity))
        }
        @JavascriptInterface fun saveBase64(name: String, mime: String, b64: String) {
            try {
                val bytes = Base64.decode(b64, Base64.DEFAULT)
                val ext = when { mime.contains("png") -> "png"; mime.contains("jpeg") || mime.contains("jpg") -> "jpg"; mime.contains("pdf") -> "pdf"; mime.contains("calendar") -> "ics"; mime.contains("webp") -> "webp"; else -> "bin" }
                val n = name.ifBlank { "SACHIL47_" + System.currentTimeMillis() + "." + ext }
                if (Build.VERSION.SDK_INT >= 29) {
                    val cv = ContentValues().apply { put(MediaStore.Downloads.DISPLAY_NAME, n); put(MediaStore.Downloads.MIME_TYPE, mime.ifBlank { "application/octet-stream" }) }
                    val uri = contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv) ?: throw Exception("insert")
                    contentResolver.openOutputStream(uri)?.use { it.write(bytes) }
                } else {
                    val f = File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), n); f.writeBytes(bytes)
                }
                runOnUiThread { Toast.makeText(this@MainActivity, "다운로드 폴더에 저장 — $n", Toast.LENGTH_SHORT).show() }
            } catch (_: Exception) { runOnUiThread { Toast.makeText(this@MainActivity, "저장하지 못했습니다", Toast.LENGTH_SHORT).show() } }
        }
    }
}
