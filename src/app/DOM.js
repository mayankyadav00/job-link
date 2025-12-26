/*console.log("An alert will be given first");
alert("Please click OK, if you are a Human");*/

// Append "From ApnaCollege Students" to <h2>

/*
let div = document.querySelector("h2")
console.dir(div.innerText);
div.innerText = div.innerText + " From ApnaCollege Students"
console.log(div.innerText);
*/

/*
let class1 = document.getElementsByClassName("box");
// OR
let classes = document.querySelectorAll(".box");
///classes[0]
console.dir(class1);                         // both are same here 
console.log(classes);
/*classes[0].innerText="Unique 1";
classes[1].innerText="Unique 2";
classes[2].innerText="Unique 3";*/
/*
class1[0].innerText="Unique 1";
class1[1].innerText="Unique 2";
class1[2].innerText="Unique 3";
*/

//QUESTION : in notebook 

/*
let body = document.querySelector("body");
let el=document.createElement("button");
el.innerText="Click Me!";
body.prepend(el);
//body.before(el);
//body.append(el);
//let but = document.querySelector("button");
el.style.backgroundColor="red";
el.style.color = "white";
*/

/*  
let cl=document.querySelector("myClass");
cl.append()
*/

let btn = document.querySelector(".mode");
let body = document.querySelector("body");
let currMode = "light";     
btn.addEventListener("click", () => {
    if (currMode === "light") {
        currMode = "dark";
        body.classList.add("dark");
        body.classList.remove("light");
    } else {
        currMode = "light"; 
        body.classList.add("light");
        body.classList.remove("dark");
    }
    //body.classList.add(currMode);
    console.log(currMode);
});

