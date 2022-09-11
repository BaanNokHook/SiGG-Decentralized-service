let payloadFromUrl = { done: true };
window.location.search
  .split("?")[1]
  .split("&")
  .forEach((pair) => {
    const keyPair = pair.split("=");
    payloadFromUrl = { ...payloadFromUrl, ...{ [keyPair[0]]: keyPair[1] } };
  });
function sendDone(payload) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/demo/notarisation/receive-hash-done", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 201) {
      const doc = new DOMParser().parseFromString(xhr.response, "text/html");
      const main = [].slice.call(doc.body.getElementsByTagName("main"))[0];
      $("main").html(main);
    }
  };
  xhr.send(JSON.stringify(payload));
}
setTimeout(() => {
  sendDone(payloadFromUrl);
}, 10000);
