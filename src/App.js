import React, { useState, useEffect } from "react";


function completeHost(hostname) {
 // IPv6 literals, e.g. [::1] — don’t split on "."
 if (hostname.startsWith("[")) return true;


 const labels = hostname.split(".");
 if (labels.some((label) => label.length === 0)) return false;
 if (labels.length < 2) return false; // need e.g. example.com, not just "com"


 if (hostname.toLowerCase().startsWith("www.") && labels.length < 3) { // www.example is not valid, www.example.com is valid
   return false;
 }


 const tld = labels[labels.length - 1];  // last label must be at least 2 chars: example.c invalid; example.co / .com valid.
 if (tld.length < 2) return false;


 return true;
}


function isValidUrl(value) {
 const trimmed = value.trim();
 if (!trimmed) return false;
 const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
 const toParse = hasScheme ? trimmed : `https://${trimmed}`;
 try {
   const u = new URL(toParse);
   if (!completeHost(u.hostname)) return false;
   return true;
 } catch {
   return false;
 }
}




function mockCheckUrlOnServer(url) {
 return new Promise((resolve) => {
   setTimeout(() => {
     const mockDB = {
       "https://www.example.com": { exists: true, type: "folder" },
       "https://news.ycombinator.com": { exists: true, type: "folder" },
       "https://google.com/file.txt": { exists: true, type: "file" },
     };


     const result = mockDB[url] || { exists: false };
     resolve(result);
   }, 500); // simulate delay
 });
}


function normalizeUrl(input) {
 const trimmed = input.trim();
 if (!trimmed) return "";
 return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}


function App() {


const [url, setUrl] = useState("")
const normalized = normalizeUrl(url);
const valid = url.trim() === "" ? null : isValidUrl(normalized);
const [serverResult, setServerResult] = useState(null);
const [loading, setLoading] = useState(false);


useEffect(() => {
 if (!url.trim() || valid === false) {
   setServerResult(null);
   return;
 }


 const handler = setTimeout(() => {
   const normalized = normalizeUrl(url);


   setLoading(true);


   mockCheckUrlOnServer(normalized).then((res) => {
     setServerResult(res);
     setLoading(false);
   });
 }, 500); // debounce delay


 return () => clearTimeout(handler);
}, [url, valid]);


 return (
   <div
     className="App"
     style={{
       display: "flex",
       justifyContent: "center",
       alignItems: "flex-start",
       height: "100vh",
     }}
   >
     <div
       style={{
         display: "flex",
         flexDirection: "column",
         alignItems: "center",
         marginTop: "50px",
       }}
     >
       <h1>URL checker</h1>
       <input
         type="text"
         value={url}
         onChange={(e) => setUrl(e.target.value)}
         placeholder="Enter URL"
         aria-invalid={valid === false}
         style={{ marginTop: "20px", width: "300px", padding: "8px" }}
       />
       {valid === true && (
         <p style={{ color: "green", marginTop: "8px" }}>Valid URL</p>
       )}
       {valid === false && (
         <p role="alert" style={{ color:"red", marginTop: "8px" }}>
           Invalid URL. Try e.g. www.example.com or https://example.com
         </p>
       )}


       {loading && <p style={{ marginTop: "12px" }}>Checking...</p>}


       {serverResult && !loading && (
         <p role="status" style={{ marginTop: "12px" }}>
           {serverResult.exists
             ? `Exists (${serverResult.type})`
             : "Does not exist"}
         </p>
       )}
     </div>
   </div>
 );
}

export default App;
