// TelaEmail.js ou App.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

// IMPORTANTE: Substitua pelo IP da máquina onde o backend está rodando.
// Se o app estiver rodando no seu celular, 'localhost' não funcionará.
// Para descobrir seu IP no Windows, use `ipconfig` no cmd. No Mac/Linux, use `ifconfig`.
const BACKEND_URL = 'http://localhost:3001'; // Exemplo: use o IP da sua rede local

const TelaEmail = () => {
  const [destinatario, setDestinatario] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnviarEmail = async () => {
    if (!destinatario) {
      Alert.alert('Erro', 'Por favor, insira um e-mail de destinatário.');
      return;
    }
    setLoading(true);

    try {
      // Dados do e-mail que queremos enviar
      const dadosEmail = {
        to: destinatario,
        subject: 'Confirmação de Contratação de Serviço',
        html: `
          <h1>Olá!</h1>
          <p>Este é um e-mail de confirmação enviado do nosso app.</p>
          <p>O serviço foi contratado com sucesso.</p>
          <strong>Obrigado por usar nossa plataforma!</strong>
        `,
      };

      // Faz a chamada POST para o nosso backend
      const response = await axios.post(`${BACKEND_URL}/api/enviar-email`, dadosEmail);

      Alert.alert('Sucesso', response.data.success);
      setDestinatario(''); // Limpa o campo após o envio

    } catch (error) {
      console.error('Erro na chamada da API:', error);
      Alert.alert('Falha', 'Não foi possível enviar o e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste de Envio de E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail do destinatário"
        value={destinatario}
        onChangeText={setDestinatario}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Contratar Serviço (Enviar E-mail)"
          onPress={handleEnviarEmail}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
});

export default TelaEmail;