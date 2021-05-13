// AUTHENTICATION
const auth = firebase.auth(),
  provider = new firebase.auth.GoogleAuthProvider();

// AUTH: Define Login and logout sections / buttons
const loggedOut = document.getElementById("loggedOut"),
  loggedIn = document.getElementById("loggedIn"),
  login = document.getElementById("login"),
  logout = document.getElementById("logout"),
  userDetails = document.getElementById("userDetails");

// AUTH: Login / Logout button actions
login.onclick = () => auth.signInWithPopup(provider);

logout.onclick = () => auth.signOut();

// AUTH: Login content changes
auth.onAuthStateChanged((user) => {
  if (user) {
    loggedIn.hidden = false;
    loggedOut.hidden = true;
    userDetails.innerHTML = `
        <h2> Hello ${user.displayName}</h2>
        <p>${user.uid}</p>
        `;
  } else {
    loggedIn.hidden = true;
    loggedOut.hidden = false;
    userDetails.innerHTML = "";
  }
});

// TOPICS
// Firebase connection
const db = firebase.firestore();

// Create topics elements
const createTopic = document.getElementById("createTopic"),
  topicList = document.getElementById("topicList");

let topicRef, unsubscribe;

// Allow content to only be accessible to logged in users
auth.onAuthStateChanged((user) => {
  if (user) {
    // Topics collection
    topicsRef = db.collection("topics");
    // Add topic
    createTopic.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;
      topicsRef.add({
        uid: user.uid,
        title: faker.commerce.productName(),
        author: user.displayName,
        createdAt: serverTimestamp(),
      });
    };

    // Pull down topics from Firestore
    unsubscribe = topicsRef
      .where("uid", "==", user.uid)
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().title}</li>`;
        });
        topicList.innerHTML = items.join("");
      });
  }
});
