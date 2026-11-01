package com.teachingjunction.coaching

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Teaching Junction Brand Colors
val RoyalBlue900 = Color(0xFF1E3A8A)
val RoyalBlue700 = Color(0xFF1D4ED8)
val AmberAccent = Color(0xFFFBBF24)
val EmeraldSuccess = Color(0xFF10B981)

data class LiveClassItem(
    val id: String = "",
    val title: String = "",
    val teacher: String = "Er. Satyam Kumar",
    val classCategory: String = "Class 10th",
    val subject: String = "Science",
    val startTime: String = "07:00 PM",
    val meetingUrl: String = "https://meet.google.com/new",
    val status: String = "upcoming" // "upcoming", "live_now", "completed"
)

data class StudyNoteItem(
    val id: String = "",
    val title: String = "",
    val classCategory: String = "Class 10th",
    val subject: String = "Mathematics",
    val fileSize: String = "3.2 MB",
    val isProtected: Boolean = true
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TeachingJunctionTheme {
                MainScreen()
            }
        }
    }
}

@Composable
fun TeachingJunctionTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = RoyalBlue900,
            secondary = RoyalBlue700,
            tertiary = AmberAccent,
            background = Color(0xFFF8FAFC)
        ),
        content = content
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen() {
    val context = LocalContext.current
    var selectedTab by remember { mutableIntStateOf(0) }
    var isApprovedStudent by remember { mutableStateOf(true) }

    val liveClasses = remember {
        listOf(
            LiveClassItem(
                id = "live-1",
                title = "Class 10th Science: Chemical Reactions Live Doubt Solving",
                teacher = "Er. Satyam Kumar",
                classCategory = "Class 10th",
                subject = "Science",
                startTime = "06:30 PM",
                meetingUrl = "https://meet.google.com/abc-defg-hij",
                status = "live_now"
            ),
            LiveClassItem(
                id = "live-2",
                title = "Class 12th Physics: Electrostatics Masterclass",
                teacher = "Er. Satyam Kumar",
                classCategory = "Class 12th",
                subject = "Physics",
                startTime = "Tomorrow 05:00 PM",
                meetingUrl = "https://meet.google.com/xyz-uvwx-rst",
                status = "upcoming"
            )
        )
    }

    val studyNotes = remember {
        listOf(
            StudyNoteItem("note-1", "Chapter 1: Real Numbers Golden Notes", "Class 10th", "Mathematics", "2.8 MB"),
            StudyNoteItem("note-2", "Light: Reflection and Refraction NCERT Blueprint", "Class 10th", "Science", "4.1 MB"),
            StudyNoteItem("note-3", "Acids, Bases & Salts Hand-Written Revision", "Class 10th", "Science", "3.4 MB"),
            StudyNoteItem("note-4", "Electric Charges & Fields 10-Year Solved PYQs", "Class 12th", "Physics", "5.2 MB")
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Teaching Junction Coaching",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Text(
                            text = "Director: Er. Satyam Kumar | Classes 6th–12th",
                            fontSize = 11.sp,
                            color = Color(0xFFDBEAFE)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = RoyalBlue900
                ),
                actions = {
                    IconButton(onClick = {
                        val callIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:+919876543210"))
                        context.startActivity(callIntent)
                    }) {
                        Icon(Icons.Default.Phone, contentDescription = "Helpline", tint = AmberAccent)
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar(containerColor = Color.White) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home", fontSize = 11.sp) }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.VideoCall, contentDescription = "Live Classes") },
                    label = { Text("Live", fontSize = 11.sp) }
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.MenuBook, contentDescription = "Notes") },
                    label = { Text("Notes", fontSize = 11.sp) }
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                    label = { Text("Profile", fontSize = 11.sp) }
                )
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding).fillMaxSize().background(Color(0xFFF8FAFC))) {
            when (selectedTab) {
                0 -> HomeScreen(onOpenLive = { selectedTab = 1 }, onOpenNotes = { selectedTab = 2 })
                1 -> LiveClassesScreen(liveClasses = liveClasses, isApproved = isApprovedStudent)
                2 -> StudyNotesScreen(notes = studyNotes, isApproved = isApprovedStudent)
                3 -> ProfileScreen(isApproved = isApprovedStudent, onToggleApproval = { isApprovedStudent = !isApprovedStudent })
            }
        }
    }
}

@Composable
fun HomeScreen(onOpenLive: () -> Unit, onOpenNotes: () -> Unit) {
    val context = LocalContext.current
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Hero Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.Transparent)
            ) {
                Box(
                    modifier = Modifier
                        .background(
                            Brush.linearGradient(
                                listOf(RoyalBlue900, RoyalBlue700)
                            )
                        )
                        .padding(20.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Surface(
                            shape = RoundedCornerShape(50),
                            color = Color.White.copy(alpha = 0.15f)
                        ) {
                            Text(
                                text = "Session 2026-27 • Board Prep",
                                color = AmberAccent,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                            )
                        }
                        Text(
                            text = "Achieve 100% Board Success",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Text(
                            text = "Comprehensive foundation lectures, hand-written PDF notes and live doubt-solving sessions.",
                            fontSize = 12.sp,
                            color = Color(0xFFE0E7FF)
                        )
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.padding(top = 4.dp)) {
                            Button(
                                onClick = onOpenLive,
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDC2626)),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Default.LiveTv, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(6.dp))
                                Text("Live Classes", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                            Button(
                                onClick = onOpenNotes,
                                colors = ButtonDefaults.buttonColors(containerColor = AmberAccent, contentColor = Color.Black),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(6.dp))
                                Text("PDF Notes", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        // Quick WhatsApp Helpline Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFECFDF5))
            ) {
                Row(
                    modifier = Modifier.padding(16.dp).fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Admissions & Doubts Helpline", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color(0xFF065F46))
                        Text("Chat with Er. Satyam Kumar on WhatsApp", fontSize = 11.sp, color = Color(0xFF047857))
                    }
                    Button(
                        onClick = {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/919876543210?text=Hello%20Teaching%20Junction%20Coaching"))
                            context.startActivity(intent)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Chat", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun LiveClassesScreen(liveClasses: List<LiveClassItem>, isApproved: Boolean) {
    val context = LocalContext.current
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text("Live Virtual Classrooms", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Color(0xFF0F172A))
            Text("Join scheduled lectures with teacher via Google Meet or YouTube Live.", fontSize = 12.sp, color = Color(0xFF64748B))
        }

        items(liveClasses) { lc ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = if (lc.status == "live_now") Color(0xFFFEE2E2) else Color(0xFFEFF6FF)
                        ) {
                            Text(
                                text = if (lc.status == "live_now") "● LIVE NOW" else "UPCOMING",
                                color = if (lc.status == "live_now") Color(0xFFDC2626) else RoyalBlue700,
                                fontWeight = FontWeight.Black,
                                fontSize = 10.sp,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }
                        Text("${lc.classCategory} • ${lc.subject}", fontSize = 11.sp, color = Color(0xFF64748B))
                    }

                    Text(lc.title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF0F172A))
                    Text("Instructor: ${lc.teacher} | Time: ${lc.startTime}", fontSize = 11.sp, color = Color(0xFF475569))

                    Button(
                        onClick = {
                            if (!isApproved) {
                                Toast.makeText(context, "Account approval pending by Admin", Toast.LENGTH_LONG).show()
                            } else {
                                try {
                                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(lc.meetingUrl))
                                    context.startActivity(intent)
                                } catch (e: Exception) {
                                    Toast.makeText(context, "Cannot open meeting link: ${e.message}", Toast.LENGTH_SHORT).show()
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (lc.status == "live_now") Color(0xFFDC2626) else RoyalBlue700
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth().padding(top = 4.dp)
                    ) {
                        Icon(Icons.Default.VideoCall, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text(
                            text = if (lc.status == "live_now") "Join Live Class Now" else "Set Reminder / Join",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun StudyNotesScreen(notes: List<StudyNoteItem>, isApproved: Boolean) {
    val context = LocalContext.current
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text("Handwritten PDF Notes", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Color(0xFF0F172A))
            Text("Download and read high-retention revision notes offline on your device.", fontSize = 12.sp, color = Color(0xFF64748B))
        }

        items(notes) { note ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(2.dp)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp).fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f).padding(end = 12.dp)) {
                        Text("${note.classCategory} • ${note.subject}", fontSize = 11.sp, color = RoyalBlue700, fontWeight = FontWeight.Bold)
                        Text(note.title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                        Text("Size: ${note.fileSize} • Verified Curriculum", fontSize = 10.sp, color = Color(0xFF94A3B8))
                    }

                    Button(
                        onClick = {
                            if (!isApproved) {
                                Toast.makeText(context, "Pending admin approval to download protected notes", Toast.LENGTH_SHORT).show()
                            } else {
                                Toast.makeText(context, "Downloading ${note.title}...", Toast.LENGTH_SHORT).show()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue900),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Download", fontSize = 11.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun ProfileScreen(isApproved: Boolean, onToggleApproval: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Student Profile", fontSize = 18.sp, fontWeight = FontWeight.Black)
                Text("Name: Rahul Sharma", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Text("Class: 10th Board Batch", fontSize = 12.sp, color = Color(0xFF475569))

                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (isApproved) Color(0xFFDCFCE7) else Color(0xFFFEF3C7)
                ) {
                    Text(
                        text = if (isApproved) "Status: Approved by Admin" else "Status: Pending Verification",
                        color = if (isApproved) Color(0xFF15803D) else Color(0xFFB45309),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }

                Button(
                    onClick = onToggleApproval,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
                ) {
                    Text("Toggle Student Approval State (Demo Test)")
                }
            }
        }
    }
}
