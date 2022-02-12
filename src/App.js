import firebase from "./firebaseConnection";
import { useState, useEffect } from "react";

import "./style.css";

function App() {
  const [idPost, setIdPost] = useState("");
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [post, setPost] = useState([]);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  useEffect(() => {
    async function loadPost(post) {
      await firebase
        .firestore()
        .collection("posts")
        .onSnapshot((doc) => {
          let myPosts = [];

          doc.forEach((item) => {
            myPosts.push({
              id: item.id,
              titulo: item.data().titulo,
              autor: item.data().autor,
            });
          });
          setPost(myPosts);
        });
    }

    loadPost();
  }, []);

  useEffect(() => {
    async function checkLogin(){
      await firebase.auth().onAuthStateChanged((user) => {
        if(user){
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email: user.email
          });
        }else{
          setUser(false);
          setUserLogged({});
        }
      })
    }
    checkLogin();
  },[])

  async function handleAdd() {
    await firebase
      .firestore()
      .collection("posts")
      .add({
        //Gerando ID automatico
        titulo: titulo,
        autor: autor,
        // .doc('12345')
        // .set({
        //   titulo: titulo,
        //   autor: autor
      })
      .then(() => {
        alert("Dados salvos com sucesso!");
        setTitulo("");
        setAutor("");
      })
      .catch((error) => {
        alert(`erro ao salvar dados ${error}`);
      });
  }

  async function buscaPost() {
    await firebase
      .firestore()
      .collection("posts")
      .get()
      .then((snapshot) => {
        let list = [];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPost(list);
      })
      .catch((error) => {
        alert(`erro ao buscar dados ${error}`);
      });
    // await firebase.firestore().collection('posts')
    //   .doc('12345')
    //   .get()
    //   .then((snapshot) => {
    //     setTitulo(snapshot.data().titulo);
    //     setAutor(snapshot.data().autor);
    //   })
    //   .catch((error) => {
    //     alert(`Erro ao buscar item ${error}`)
    //   })
  }

  async function editarPost() {
    await firebase
      .firestore()
      .collection("posts")
      .doc(idPost)
      .update({
        titulo: titulo,
        autor: autor,
      })
      .then(() => {
        alert("Dados editados com sucesso!");
        setTitulo("");
        setAutor("");
        setIdPost("");
      })
      .catch((error) => alert(`Erro ao editar dados ${error}`));
  }

  async function excluirPost(id){
    await firebase.firestore().collection("posts").doc(id)
      .delete()
        .then(()=>{
          alert("Esse post foi excluido")
      })
  }

  async function novousuario(){
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then(() => {
         alert("cadastrado com sucesso!")
          setEmail(''); setSenha('');
        })
        .catch((error) => {
          if(error.code === 'auth/weak-password'){
            alert('Senha muito fraca')
          }
          else if(error.code === 'auth/email-already-in-use'){
            alert('Email ja esta sendo usado, faca login ou escolha outro email')
          }
        })
  }
  async function logout(){
    await firebase.auth().signOut();
  }

  async function fazerLogin(){
    await firebase.auth().signInWithEmailAndPassword(email, senha)
      .then((value) => {
        console.log(value)
      })
      .catch((error) => {
        alert(`Login invalido ${error}`)
      })
  }


  return (
    <div>
      <h1>ReactJS + Firebase</h1> <br />

      {user && (
        <div>
          <strong>Seja bem vindo! (Voce esta logado)</strong><br />
          <span>{userLogged.uid} - {userLogged.email}</span>
          <br/><br />
        </div>
      )}

      <div className="container">
        <label>Email</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
       
        <label>Senha</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}/> <br />

        <button onClick={fazerLogin}>Login</button>
        <button onClick={novousuario}>Cadastrar</button>
        <button onClick={logout}>Sair da conta</button>
      </div> <br /> <br />

      <hr/> <br />




      <div className="container">
        <h1>Banco de dados:</h1>
        <label>ID: </label>
        <input
          type="text"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />

        <label>Titulo: </label>
        <textarea
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Autor: </label>
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscaPost}>Buscar Post</button>
        <br />
        <button onClick={editarPost}>Editar Post</button>
        <br />

        <ul>
          {post.map((item) => {
            return (
              <li key={item.id}>
                <span>ID - {item.id}</span> <br />
                <span>Titulo: {item.titulo}</span>
                <br />
                <span>Autor: {item.autor}</span>
                <br />
                <button onClick={() => excluirPost(item.id) }>excluir</button> <br /> <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
