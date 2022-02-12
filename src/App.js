import firebase from "./firebaseConnection";
import { useState, useEffect } from "react";

import "./style.css";

function App() {
  const [idPost, setIdPost] = useState("");
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [post, setPost] = useState([]);

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

  return (
    <div>
      <h1>ReactJS + Firebase</h1> <br />
      <div className="container">
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
                <br /> <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
