import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { fetchWithAuth } from '../../lib/api';

export default function CoursePlayerScreen() {
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Initialize the native video player using Expo Video Hooks
  const player = useVideoPlayer(activeVideoUrl, player => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    loadCourseDetails();
  }, [id]);

  const loadCourseDetails = async () => {
    try {
      const data = await fetchWithAuth(`/student/courses/${id}`);
      setCourse(data);
      
      // Auto-select the first lesson if available
      if (data.modules?.[0]?.lessons?.[0]) {
        handleLessonSelect(data.modules[0].lessons[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson: any) => {
    setActiveLesson(lesson);
    const videoAttachment = lesson.attachments?.find((a: any) => a.type === 'VIDEO');
    if (videoAttachment) {
      setActiveVideoUrl(videoAttachment.url);
    } else {
      setActiveVideoUrl(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Native Video Player Section */}
      <View style={styles.playerContainer}>
        {activeVideoUrl ? (
          <VideoView 
            style={styles.video} 
            player={player} 
            allowsFullscreen 
            allowsPictureInPicture 
          />
        ) : (
          <View style={styles.noVideoPlaceholder}>
            <Text style={styles.noVideoText}>No video for this lesson</Text>
          </View>
        )}
      </View>

      {/* Syllabus Section */}
      <ScrollView style={styles.syllabusContainer}>
        <View style={styles.lessonHeader}>
          <Text style={styles.activeLessonTitle}>{activeLesson?.title || 'Select a lesson'}</Text>
        </View>

        {course?.modules?.map((module: any) => (
          <View key={module.id} style={styles.moduleCard}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            
            {module.lessons?.map((lesson: any) => (
              <TouchableOpacity 
                key={lesson.id} 
                style={[
                  styles.lessonRow, 
                  activeLesson?.id === lesson.id && styles.activeLessonRow
                ]}
                onPress={() => handleLessonSelect(lesson)}
              >
                <View style={styles.lessonIconPlaceholder} />
                <Text style={[
                  styles.lessonRowTitle,
                  activeLesson?.id === lesson.id && styles.activeLessonRowTitle
                ]}>
                  {lesson.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  noVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideoText: {
    color: '#fff',
    fontSize: 16,
  },
  syllabusContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  lessonHeader: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  activeLessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  moduleCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  moduleTitle: {
    padding: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    backgroundColor: '#f3f4f6',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activeLessonRow: {
    backgroundColor: '#eff6ff',
  },
  lessonIconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#d1d5db',
    marginRight: 12,
  },
  lessonRowTitle: {
    fontSize: 15,
    color: '#4b5563',
  },
  activeLessonRowTitle: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
