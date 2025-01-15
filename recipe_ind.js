let meal_id = window.location.search.split("=")[1]
let meal_details;
fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_id}`)
.then((res) => res.json())
.then((meal_dt) => {
    meal_details = meal_dt.meals[0];
    console.log(meal_details)

    meal_name = document.getElementById("title");
    //add title
    meal_name.innerText = meal_details["strMeal"];
    console.log(meal_name)
    let meal_img = document.createElement("img");
    meal_img.src = meal_details["strMealThumb"];
    //add list of ingredients
    for (let i = 1; i < 21; i++) {
        if (meal_details[`strIngredient${i}`]) {
            let ingredient = document.createElement("li");
            ingredient.innerHTML = `${meal_details[`strIngredient${i}`]} - ${meal_details[`strMeasure${i}`]}`;
            if (i < 11) {
                document.getElementById("ingredients_one").appendChild(ingredient);
            } else {
                document.getElementById("ingredients_two").appendChild(ingredient);
            }
            
        }
    }
    //add image
    document.getElementById("main").appendChild(meal_img);
    let text = meal_details["strInstructions"].split(".");
    console.log(text);
    //add instructions
    let middle  = (text.length)/2;
    let new_text = [];
    for (let i = 0; i < text.length; i++) {
        if (!parseInt(text[i])){
            new_text.push(text[i]);
        }
    }
    console.log(new_text)
    let counter = 1;
    for (let i = 0; i < new_text.length; i++){
        if (new_text[i]){
            let instructions = document.createElement("p");
            instructions.innerHTML = `${counter}. ${new_text[i]}`;
            counter++;
            if (i < middle) {
                document.getElementById("instructions_one").appendChild(instructions);
            } else {
                document.getElementById("instructions_two").appendChild(instructions);
            }
        }
        
    }
    //add article, video and p
    
    if (meal_details["strYoutube"]){
        let video = document.createElement("iframe")
        let video_src = meal_details["strYoutube"].split("watch?v=").join("embed/");
        video.src = video_src;
        console.log(video.src);
        document.body.appendChild(video);
    };
    if (meal_details["strSource"]) {
        let article = document.createElement("h3");
        let link = document.createElement("a");
        link.href = meal_details["strSource"];
        article.innerHTML = "Check out the full detailed recipe";
        link.style.textDecoration = "none";
        link.style.textAlign = "center"
        link.appendChild(article);
        document.body.appendChild(link);
    };
})
