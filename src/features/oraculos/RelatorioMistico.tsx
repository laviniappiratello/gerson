import React from 'react';
import { ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { globalStyles as GStyles, Colors } from '../../styles/GlobalStyles';

interface Props {
  perfil: any;
  onVoltar: () => void;
  onConfirmar: () => void;
}

export function RelatorioMistico({ perfil, onVoltar, onConfirmar }: Props) {
  return (
    <ScrollView 
      contentContainerStyle={{ paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center' }} 
      style={{ flex: 1, backgroundColor: Colors.deepBlue }}
    >
      <Text style={[GStyles.title, { marginBottom: 15, fontSize: 38, letterSpacing: 2 }]}>
        LEITURA PESSOAL
      </Text>


<View style={{ width: '100%', marginBottom: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
  <Image 
    source={perfil.signoInfo.imagem} 
    style={{ width: 140, height: 140, borderRadius: 5 }} 
    resizeMode="contain" 
  />
  <View style={{ flex: 1, marginLeft: 20, backgroundColor: 'transparent' }}>
    <Text style={{ color: Colors.gold, fontSize: 20, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 5 }}>
      {perfil.nomeSigno.toUpperCase()}
    </Text>
    <Text style={{ color: '#fff', fontSize: 14, lineHeight: 20, opacity: 0.9 }}>
      {perfil.signoInfo.descricao}
    </Text>
  </View>
</View>

<View style={{ width: '100%', marginBottom: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
  <View style={{ flex: 1, marginRight: 20, backgroundColor: 'transparent' }}>
    <Text style={{ color: Colors.gold, fontSize: 20, fontWeight: 'bold', letterSpacing: 1.5, textAlign: 'right', marginBottom: 5 }}>
      {perfil.nomeArcano.toUpperCase()}
    </Text>
    <Text style={{ color: '#fff', fontSize: 14, lineHeight: 20, textAlign: 'right', opacity: 0.9 }}>
      {perfil.arcanoInfo.descricao}
    </Text>
  </View>
  <Image 
    source={perfil.arcanoInfo.imagem} 
    style={{ width: 140, height: 220, borderRadius: 5 }} 
    resizeMode="contain" 
  />
</View>

      
      <TouchableOpacity style={[GStyles.mainButton, { width: '100%' }]} onPress={onConfirmar}>
        <Text style={GStyles.buttonText}>ACESSAR ORÁCULOS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 25 }} onPress={onVoltar}>
        <Text style={{ color: Colors.gold, opacity: 0.8 }}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}