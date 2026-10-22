package com.sachil47.app

import android.app.Activity
import android.app.KeyguardManager
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.view.Gravity
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** 가운데 팝업 — 잠금 화면 위·다른 앱 위. [초과근무 계속] [초과근무 종료] [5분 뒤] 한 번 누르기 */
class AlarmActivity : Activity() {
    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        setShowWhenLocked(true); setTurnScreenOn(true)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        try { getSystemService(KeyguardManager::class.java).requestDismissKeyguard(this, null) } catch (_: Exception) { }
        setFinishOnTouchOutside(false)
        val d = resources.displayMetrics.density
        fun px(v: Int) = (v * d).toInt()
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL; gravity = Gravity.CENTER_HORIZONTAL
            setPadding(px(22), px(22), px(22), px(18))
            background = GradientDrawable().apply { setColor(Color.parseColor("#0B1B3F")); cornerRadius = px(22).toFloat() }
        }
        fun tv(t: String, sp: Float, col: String, bold: Boolean) = TextView(this).apply {
            text = t; textSize = sp; setTextColor(Color.parseColor(col)); gravity = Gravity.CENTER
            if (bold) setTypeface(typeface, Typeface.BOLD)
        }
        root.addView(tv("⏰ 초과근무 확인 시간", 20f, "#FDD000", true))
        root.addView(tv(SimpleDateFormat("HH:mm", Locale.KOREA).format(Date()), 56f, "#FFFFFF", true))
        val iv = Ot.ivMin(this)
        val next = SimpleDateFormat("HH:mm", Locale.KOREA).format(Date(System.currentTimeMillis() + iv * 60_000L))
        root.addView(tv("${iv}분 간격 · 계속하면 다음 확인 $next", 14f, "#CCD3E0", false))
        fun btn(t: String, bg: String, fg: String, type: String, h: Int) = Button(this).apply {
            text = t; textSize = 19f; setTextColor(Color.parseColor(fg)); isAllCaps = false; setTypeface(typeface, Typeface.BOLD)
            background = GradientDrawable().apply { setColor(Color.parseColor(bg)); cornerRadius = px(16).toFloat()
                if (bg == "#00000000") setStroke(px(2), Color.parseColor("#8090A8")) }
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, px(h)).apply { topMargin = px(10) }
            setOnClickListener { Ot.act(this@AlarmActivity, type); finish() }
        }
        root.addView(btn("초과근무 계속", "#FDD000", "#0B1B3F", "ok", 64))
        root.addView(btn("초과근무 종료", "#00000000", "#FFFFFF", "end", 56))
        root.addView(btn("${Ot.SNOOZE_MIN}분 뒤 다시", "#1B2C55", "#FFFFFF", "snz", 48))
        setContentView(root, ViewGroup.LayoutParams(px(320), ViewGroup.LayoutParams.WRAP_CONTENT))
    }

    @Deprecated("back = 5분 뒤가 아니라 그대로 두기(알람 유지)")
    override fun onBackPressed() { /* 실수로 닫히지 않게 — 버튼으로만 */ }
}
