import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2563eb' }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'My Learning',
          tabBarLabel: 'Courses'
        }} 
      />
    </Tabs>
  );
}
