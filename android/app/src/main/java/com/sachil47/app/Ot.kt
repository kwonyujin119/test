package com.sachil47.app

import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import android.provider.Settings
import org.json.JSONArray
import org.json.JSONObject

/**
 * 초과근무 알리미(앱) — 확인 시각에 휴대폰 알람처럼 울린다.
 * 웹 화면이 꺼져 있어도, 다른 앱을 쓰는 중이어도: 알람(AlarmManager) → 가운데 팝업(AlarmActivity) + 반복 알람음·진동(알림 채널).
 * 사용자가 누른 '계속·종료·5분 뒤'는 여기 기록해 두었다가 웹 화면이 다시 열리면 넘겨 준다(takeEvents).
 */
object Ot {
    private const val PREF = "ot"
    const val CH = "ot_alarm_v1"
    const val NOTI_ID = 4701
    const val SNOOZE_MIN = 5

    private fun prefs(c: Context) = c.getSharedPreferences(PREF, Context.MODE_PRIVATE)

    fun ivMin(c: Context) = prefs(c).getInt("iv", 50)
    fun due(c: Context) = prefs(c).getLong("due", 0L)
    fun on(c: Context) = prefs(c).getBoolean("on", false)

    fun schedule(c: Context, due: Long, iv: Int) {
        prefs(c).edit().putLong("due", due).putInt("iv", iv).putBoolean("on", true).apply()
        setAlarm(c, due)
    }

    fun cancel(c: Context) {
        prefs(c).edit().putBoolean("on", false).apply()
        val am = c.getSystemService(AlarmManager::class.java)
        am.cancel(firePi(c))
        clearNoti(c)
    }

    private fun firePi(c: Context): PendingIntent =
        PendingIntent.getBroadcast(c, 1, Intent(c, AlarmReceiver::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

    private fun setAlarm(c: Context, at: Long) {
        val am = c.getSystemService(AlarmManager::class.java)
        val show = PendingIntent.getActivity(c, 2, Intent(c, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        val canExact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || am.canScheduleExactAlarms()
        if (canExact) am.setAlarmClock(AlarmManager.AlarmClockInfo(at, show), firePi(c))
        else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, firePi(c))
    }

    fun ensureChannel(c: Context) {
        val nm = c.getSystemService(NotificationManager::class.java)
        if (nm.getNotificationChannel(CH) != null) return
        val ch = NotificationChannel(CH, "초과근무 확인 알람", NotificationManager.IMPORTANCE_HIGH)
        ch.description = "확인 시각에 울리는 알람(가운데 팝업·알람음·진동)"
        ch.enableVibration(true)
        ch.vibrationPattern = longArrayOf(0, 900, 200, 900, 200, 900, 200, 1200)
        ch.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM),
            AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build())
        ch.lockscreenVisibility = Notification.VISIBILITY_PUBLIC
        ch.setBypassDnd(true)
        nm.createNotificationChannel(ch)
    }

    /** 확인 시각 — 알람 알림(가운데 팝업 연결, 알람음·진동 반복) + 다른 앱 위 표시 권한이 있으면 팝업을 바로 띄움 */
    fun fire(c: Context) {
        if (!on(c)) return
        ensureChannel(c)
        val full = PendingIntent.getActivity(c, 3,
            Intent(c, AlarmActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_NO_USER_ACTION),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        fun act(type: String, code: Int): Notification.Action {
            val pi = PendingIntent.getBroadcast(c, code, Intent(c, ActionReceiver::class.java).putExtra("t", type),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
            val label = when (type) { "ok" -> "초과근무 계속"; "end" -> "초과근무 종료"; else -> "${SNOOZE_MIN}분 뒤" }
            return Notification.Action.Builder(null, label, pi).build()
        }
        val n = Notification.Builder(c, CH)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("⏰ 초과근무 확인 시간")
            .setContentText("${ivMin(c)}분 간격 · 계속하거나 종료하세요")
            .setCategory(Notification.CATEGORY_ALARM)
            .setOngoing(true)
            .setAutoCancel(false)
            .setFullScreenIntent(full, true)
            .setContentIntent(full)
            .addAction(act("ok", 11))
            .addAction(act("end", 12))
            .addAction(act("snz", 13))
            .build()
        n.flags = n.flags or Notification.FLAG_INSISTENT   // 누를 때까지 알람음·진동 반복
        c.getSystemService(NotificationManager::class.java).notify(NOTI_ID, n)
        if (Settings.canDrawOverlays(c)) {   // 다른 앱 위 표시 권한 → 쓰는 중이어도 가운데 팝업을 바로
            try { c.startActivity(Intent(c, AlarmActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) } catch (_: Exception) { }
        }
    }

    fun clearNoti(c: Context) {
        c.getSystemService(NotificationManager::class.java).cancel(NOTI_ID)
    }

    /** 팝업·알림 버튼 — ok: 확인하고 계속(다음 확인 = 지금 + 간격), end: 종료, snz: 5분 뒤 다시 */
    fun act(c: Context, type: String) {
        val now = System.currentTimeMillis()
        clearNoti(c)
        addEvent(c, type, now)
        when (type) {
            "ok" -> schedule(c, now + ivMin(c) * 60_000L, ivMin(c))
            "snz" -> schedule(c, now + SNOOZE_MIN * 60_000L, ivMin(c))
            "end" -> cancel(c)
        }
        c.sendBroadcast(Intent("com.sachil47.app.OT_EVENT").setPackage(c.packageName))
    }

    private fun addEvent(c: Context, type: String, at: Long) {
        val arr = try { JSONArray(prefs(c).getString("ev", "[]")) } catch (_: Exception) { JSONArray() }
        arr.put(JSONObject().put("t", type).put("at", at))
        prefs(c).edit().putString("ev", arr.toString()).apply()
    }

    fun takeEvents(c: Context): String {
        val s = prefs(c).getString("ev", "[]") ?: "[]"
        prefs(c).edit().putString("ev", "[]").apply()
        return s
    }
}
