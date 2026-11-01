# Teaching Junction Coaching - Companion Native Android App Guide
## (Kotlin + Jetpack Compose Architecture Guide)

यह गाइड समझाती है कि कैसे आप **Teaching Junction Coaching** के लिए एक अलग, पूर्णतः नेटिव Android एप्लिकेशन (Kotlin और Jetpack Compose का उपयोग करके) तैयार कर सकते हैं, जो इसी समान वेब एप्लिकेशन के डेटाबेस और ऑथेंटिकेशन के साथ 100% सिंक्रोनाइज़ (Synchronized) रहेगा।

---

## 1. Core Architecture Principles (मुख्य सिद्धांत)
1. **Single Source of Truth (समान डेटाबेस)**:
   - Android ऐप कोई अलग या डुप्लीकेट डेटाबेस नहीं बनाएगा।
   - यह ऐप उसी **Firebase Authentication** और **Cloud Firestore** संग्रह (Collections) से सीधा कनेक्ट होगा।
2. **Real-time Synchronized Student State**:
   - जब कोई छात्र Android ऐप से रजिस्टर करेगा, उसका स्टेटस Firestore के `users` संग्रह में `status: "pending"` दर्ज होगा।
   - जब एडमिन वेब पैनल (Admin Panel) से छात्र को **Approve** करेगा, Android ऐप में Real-time Snapshot Listener के ज़रिए बिना ऐप रीस्टार्ट किए छात्र को तुरंत सभी पेड/फ्री कोर्सेज़ और PDF नोट्स का एक्सेस मिल जाएगा।
3. **Live Classes Integration**:
   - एडमिन द्वारा वेब पर शेड्यूल की गई Google Meet या YouTube Live क्लासेस Android ऐप में सीधे Real-time दिखाई देंगी।
   - "Join Live Class" दबाने पर Android का Intent सिस्टम सीधे Google Meet या YouTube ऐप में क्लास रूम खोल देगा।

---

## 2. Recommended Tech Stack for Native Android
| Component | Technology | Rationale |
|---|---|---|
| **Language** | Kotlin 2.0+ | Modern, safe, null-safe language for Android |
| **UI Framework** | Jetpack Compose + Material 3 | Declarative UI matching modern Royal Blue theme |
| **Architecture** | MVVM + Clean Architecture | Repository pattern, ViewModels, and StateFlow |
| **Backend & Auth** | Firebase Android BOM (Auth + Firestore + Storage) | Directly syncs with web app |
| **Async & Flow** | Kotlin Coroutines + StateFlow | Reactive Firestore snapshot listening |
| **Navigation** | Navigation Compose | Type-safe declarative screens |
| **PDF Viewing** | Android PdfRenderer or AndroidX PDF | High-speed native PDF rendering |
| **Image Loading** | Coil Compose | Fast thumbnail caching |

---

## 3. Project Configuration (`build.gradle.kts`)

### Module `app/build.gradle.kts`:
```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.google.gms.google.services) // Firebase Plugin
}

android {
    namespace = "com.teachingjunction.coaching"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.teachingjunction.coaching"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)

    // Firebase (Same Project as Web App)
    implementation(platform("com.google.firebase:firebase-bom:33.7.0"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-storage-ktx")

    // Image & PDF Loading
    implementation("io.coil-kt:coil-compose:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
}
```

---

## 4. Synchronized Data Models (Kotlin)

वेब ऐप के `src/types/index.ts` के समान डेटा मॉडल:

```kotlin
package com.teachingjunction.coaching.model

data class UserProfile(
    val uid: String = "",
    val name: String = "",
    val email: String = "",
    val phone: String = "",
    val role: String = "student", // "admin" or "student"
    val status: String = "pending", // "pending", "approved", "rejected", "suspended"
    val studentClass: String = "Class 10th",
    val enrolledCourses: List<String> = emptyList(),
    val createdAt: Long = System.currentTimeMillis()
)

data class LiveClass(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val teacher: String = "",
    val classCategory: String = "",
    val subject: String = "",
    val date: String = "",
    val startTime: String = "",
    val meetingUrl: String = "",
    val platform: String = "google_meet", // "google_meet" or "youtube_live"
    val status: String = "upcoming" // "upcoming", "live_now", "completed"
)

data class ContactInfo(
    val phone: String = "+91 98765 43210",
    val whatsapp: String = "+91 98765 43210",
    val email: String = "contact@teachingjunction.edu",
    val address: String = "Near Main Market, Teaching Junction Campus",
    val website: String = "https://teachingjunction.edu",
    val directorName: String = "Er. Satyam Kumar (B.Tech)",
    val helplineHours: String = "Mon-Sat: 8:00 AM - 8:00 PM"
)

data class Course(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val type: String = "free", // "free" or "paid"
    val price: Double = 0.0,
    val classCategory: String = "",
    val subject: String = "",
    val instructor: String = "",
    val isFeatured: Boolean = false
)
```

---

## 5. Firebase Real-time Firestore Sync (Repository Pattern)

```kotlin
package com.teachingjunction.coaching.repository

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.teachingjunction.coaching.model.LiveClass
import com.teachingjunction.coaching.model.UserProfile
import com.teachingjunction.coaching.model.ContactInfo
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow

class TeachingJunctionRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    // 1. Current Student Profile Real-time Listener (Check Approval State)
    fun observeCurrentStudentProfile(): Flow<UserProfile?> = callbackFlow {
        val uid = auth.currentUser?.uid
        if (uid == null) {
            trySend(null)
            close()
            return@callbackFlow
        }

        val listener = firestore.collection("users").document(uid)
            .addSnapshotListener { snapshot, error ->
                if (error != null) return@addSnapshotListener
                val user = snapshot?.toObject(UserProfile::class.java)
                trySend(user)
            }

        awaitClose { listener.remove() }
    }

    // 2. Real-time Live Classes Sync
    fun observeLiveClasses(): Flow<List<LiveClass>> = callbackFlow {
        val listener = firestore.collection("live_classes")
            .orderBy("startTime")
            .addSnapshotListener { snapshot, error ->
                if (error != null) return@addSnapshotListener
                val classes = snapshot?.documents?.mapNotNull { it.toObject(LiveClass::class.java) } ?: emptyList()
                trySend(classes)
            }

        awaitClose { listener.remove() }
    }

    // 3. Dynamic Coaching Contact Info Sync
    fun observeContactInfo(): Flow<ContactInfo?> = callbackFlow {
        val listener = firestore.collection("settings").document("contact")
            .addSnapshotListener { snapshot, _ ->
                val contact = snapshot?.toObject(ContactInfo::class.java)
                trySend(contact)
            }
        awaitClose { listener.remove() }
    }
}
```

---

## 6. Jetpack Compose UI: Live Class Room Launching

Android Intent का उपयोग करके Google Meet या YouTube Live लिंक को सीधे नेटिव ऐप्लिकेशन में खोला जाता है:

```kotlin
package com.teachingjunction.coaching.ui

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.teachingjunction.coaching.model.LiveClass
import com.teachingjunction.coaching.model.UserProfile

fun launchLiveClass(context: Context, liveClass: LiveClass, user: UserProfile?) {
    // Security check: Only approved students or admin
    if (user == null || (user.status != "approved" && user.role != "admin")) {
        Toast.makeText(context, "Account verification pending by Admin", Toast.LENGTH_LONG).show()
        return
    }

    try {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(liveClass.meetingUrl))
        context.startActivity(intent)
    } catch (e: Exception) {
        Toast.makeText(context, "Cannot open meeting URL: ${e.message}", Toast.LENGTH_SHORT).show()
    }
}
```

---

## 7. Connecting Android and Web App to the Same Firebase Project
1. **Download `google-services.json`** from the same Firebase Console project where the web app is registered.
2. Place `google-services.json` into the Android project's `app/` folder.
3. Add the Android SHA-1 fingerprint in Firebase Project Settings > General > Your Apps > Add Fingerprint.
4. अब वेब और Android दोनों एक ही डेटाबेस (`users`, `courses`, `live_classes`, `materials`) शेयर करेंगे।
