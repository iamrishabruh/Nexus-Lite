import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input, Button } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  // Add other screens here
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement login logic here
    console.log('Login attempted with:', email, password);
    navigation.navigate('Dashboard');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login to Nexus</Text>
      <Input 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        marginBottom={3}
      />
      <Input 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        type="password"
        marginBottom={5}
      />
      <Button onPress={handleLogin}>Login</Button>
    </View>
  );
};

export default LoginScreen;
