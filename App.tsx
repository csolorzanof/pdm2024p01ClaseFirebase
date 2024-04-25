/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Producto from './models/Producto';

const App = () => {
  const [usuario, setUsuario] = useState<FirebaseAuthTypes.User | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [precio, setPrecio] = useState<number>(0);
  const [descripcion, setDescripcion] = useState<string>('');
  const [imagen, setImagen] = useState<string>('');

  const [nombreEditar, setNombreEditar] = useState<string>('');
  const [precioEditar, setPrecioEditar] = useState<number>(0);
  const [descripcionEditar, setDescripcionEditar] = useState<string>('');
  const [imagenEditar, setImagenEditar] = useState<string>('');
  const [idEditar, setIdEditar] = useState<string>('');

  const [productos, setProductos] = useState<Producto[]>([]);

  const registrarUsuario = async (email: string, password: string) => {
    await auth().createUserWithEmailAndPassword(email, password);
    setEmail('');
    setPassword('');
  };

  const onChangeEmail = (text: string) => {
    setEmail(text);
  };

  const onChangePassword = (text: string) => {
    setPassword(text);
  };

  const handleRegistrar = () => {
    registrarUsuario(email, password);
  };

  const handleCerrarSesion = () => {
    auth().signOut();
  };

  const handleIniciarSesion = () => {
    auth().signInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setUsuario);
    return subscriber;
  }, []);

  const handleCrearProducto = async () => {
    await firestore().collection('productos').add({
      nombre,
      precio,
      descripcion,
      imagen,
    });
    setNombre('');
    setPrecio(0);
    setDescripcion('');
    setImagen('');
  };

  const handleEditarProducto = async () => {
    await firestore().collection('productos').doc(idEditar).update({
      nombre: nombreEditar,
      precio: precioEditar,
      descripcion: descripcionEditar,
      imagen: imagenEditar,
    });
    setNombreEditar('');
    setPrecioEditar(0);
    setDescripcionEditar('');
    setImagenEditar('');
    setIdEditar('');
  };

  const onChangeNombre = (text: string) => {
    setNombre(text);
  };

  const onChangePrecio = (text: string) => {
    setPrecio(parseFloat(text));
  };

  const onChangeDescripcion = (text: string) => {
    setDescripcion(text);
  };

  const onChangeImagen = (text: string) => {
    setImagen(text);
  };

  const onChangeNombreEditar = (text: string) => {
    setNombreEditar(text);
  };

  const onChangePrecioEditar = (text: string) => {
    setPrecioEditar(parseFloat(text));
  };

  const onChangeDescripcionEditar = (text: string) => {
    setDescripcionEditar(text);
  };

  const onChangeImagenEditar = (text: string) => {
    setImagenEditar(text);
  };

  const cargarProductoEditar = (producto: Producto) => {
    setNombreEditar(producto.nombre);
    setPrecioEditar(producto.precio);
    setDescripcionEditar(producto.descripcion);
    setImagenEditar(producto.imagen);
    setIdEditar(producto.id || '');
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('productos')
      .onSnapshot(querySnapshot => {
        const productos: Producto[] = [];
        querySnapshot.forEach(documentSnapshot => {
          const producto = documentSnapshot.data() as Producto;
          producto.id = documentSnapshot.id;
          productos.push(producto);
        });
        setProductos(productos);
      });
    return subscriber;
  }, []);

  console.log('productos', productos);
  return (
    <ScrollView>
      <View>
        <Text>
          {!usuario && 'No hay usuario'}
          {usuario && `Bienvenido/a ${usuario.email}`}
        </Text>
        <TextInput
          placeholder="email"
          id="email"
          onChangeText={onChangeEmail}
        />
        <TextInput
          placeholder="password"
          id="password"
          secureTextEntry={true}
          onChangeText={onChangePassword}
        />
        <Pressable onPress={handleRegistrar}>
          <View style={styles.boton}>
            <Text style={styles.botonColor}>Registrar Usuario</Text>
          </View>
        </Pressable>
        <Pressable onPress={handleIniciarSesion}>
          <View style={styles.botonVerde}>
            <Text style={styles.botonColor}>Iniciar Sesión</Text>
          </View>
        </Pressable>
        <Pressable onPress={handleCerrarSesion}>
          <View style={styles.botonRojo}>
            <Text style={styles.botonColor}>Cerrar Sesión</Text>
          </View>
        </Pressable>
      </View>
      <View>
        <Text>Crear Producto</Text>
        <View>
          <TextInput
            placeholder="Nombre"
            onChangeText={onChangeNombre}
            value={nombre}
          />
          <TextInput
            placeholder="Precio"
            onChangeText={onChangePrecio}
            keyboardType="numeric"
            value={precio.toString()}
          />
          <TextInput
            placeholder="Descripción"
            onChangeText={onChangeDescripcion}
            value={descripcion}
          />
          <TextInput
            placeholder="Imagen"
            onChangeText={onChangeImagen}
            value={imagen}
          />
          <Pressable onPress={handleCrearProducto}>
            <View style={styles.boton}>
              <Text style={styles.botonColor}>Crear Producto</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <View>
        <Text>Editar Producto</Text>
        <View>
          <TextInput
            placeholder="Nombre"
            onChangeText={onChangeNombreEditar}
            value={nombreEditar}
          />
          <TextInput
            placeholder="Precio"
            keyboardType="numeric"
            onChangeText={onChangePrecioEditar}
            value={precioEditar.toString()}
          />
          <TextInput
            placeholder="Descripción"
            onChangeText={onChangeDescripcionEditar}
            value={descripcionEditar}
          />
          <TextInput
            placeholder="Imagen"
            onChangeText={onChangeImagenEditar}
            value={imagenEditar}
          />
          <Pressable onPress={handleEditarProducto} disabled={idEditar == ''}>
            <View style={styles.boton}>
              <Text style={styles.botonColor}>Editar Producto</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <View>
        <Text>Productos</Text>
        <View>
          {productos.map(producto => (
            <Pressable onPress={() => cargarProductoEditar(producto)}>
              <View style={styles.contenedorProducto} key={producto.id}>
                <View style={styles.fila}>
                  <Text style={styles.titulo}>Producto:</Text>
                  <Text>{producto.nombre}</Text>
                </View>
                <View style={styles.fila}>
                  <Text style={styles.titulo}>Precio:</Text>
                  <Text>{producto.precio}</Text>
                </View>
                <View style={styles.fila}>
                  <Text style={styles.titulo}>Descripción:</Text>
                  <Text>{producto.descripcion}</Text>
                </View>
                <View style={styles.fila}>
                  <Text style={styles.titulo}>Imagen:</Text>
                  {producto.imagen && (
                    <Image
                      source={{uri: producto.imagen}}
                      style={{width: 100, height: 100}}
                    />
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  botonRojo: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  botonVerde: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  botonColor: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  titulo: {
    color: 'black',
    fontWeight: 'bold',
  },
  fila: {
    display: 'flex',
    flexDirection: 'row',
  },
  contenedorProducto: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});

export default App;
