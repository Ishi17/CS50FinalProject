let all_meals;
function search() {
    //make sure it's empty
    let e = document.getElementById("meal_opts"); 
    let child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    let query = document.getElementById("search").value;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then((res) => res.json())
    .then((meal_data) => makeCard(meal_data.meals[0]))
}
let category;
function getCategory() {
    category = document.getElementById("category").value;
};

function giveCuisine(){
    //make sure meal opts is empty
    all_meals = [];
    let el = document.getElementById("meal_opts"); 
    let meal_child = el.lastElementChild;
    while (meal_child) {
        el.removeChild(meal_child);
        meal_child = el.lastElementChild;
    }
    console.log("here")
    let areas = [];
    //make sure it's already empty
    let e = document.getElementById("cuisine"); 
    let child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    //loop through meal names
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((res) => res.json())
    .then((data) => {
        let length = data.meals.length;
        for (let i = 0; i < length; i++){
            let meal_name = data.meals[i]["strMeal"];
            //search for which cuisine it belongs to 
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal_name}`)
            .then((meal_res) => meal_res.json())
            .then((meal_data) => {
                //add it to the areas list
                let meal_area = meal_data.meals[0]["strArea"];
                if (!areas.includes(meal_area)){
                    areas.push(meal_area);
                    //add it to the drop down menu
                    let new_meal = document.createElement("option");
                    new_meal.value = meal_area;
                    new_meal.innerHTML = meal_area;
                    console.log(new_meal);
                    document.getElementById("cuisine").appendChild(new_meal);
                }
            })
        }
        document.getElementById("cuisine_div").style.visibility = "visible";
    })
} 
function ingredient_visible() {
    document.getElementById("main_ingredient_div").style.visibility = "visible";
}
let cuisine;
let reset_filter = false;
function searchIngredient() {
    let ing = document.getElementById("main_ingredient").value;
    cuisine = document.getElementById("cuisine").value;
    reset_filter = true;
    //if they didn't input any main ingredient, give them meal options
    if (!ing) {
        //find the meal options for the category
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then((res) => res.json())
        .then((data) => {
            let length = data.meals.length;
            for (let i = 0; i < length; i++){
                let meal_name = data.meals[i]["strMeal"];
            //search for which cuisine it belongs to 
                fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal_name}`)
                .then((meal_res) => meal_res.json())
                .then((meal_data) => {
                    let meal_area = meal_data.meals[0]["strArea"];
                    if (meal_area == cuisine){
                        makeCard(meal_data.meals[0])
                }
            })
        }
    })
        //check if it has the same cuisine
        //show it as an option
    } else {
        //find list of meal names with the main ingredient
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`)
        .catch(getIngRecs())
        .then((ing_res) => ing_res.json())
        .then((ing_data) => {
        //iterate through meals
            let length = ing_data.meals.length;
            for (let i = 0;i < length; i++) {
                let meal_id = ing_data.meals[i]["idMeal"];
            //seeing which ones have the right category and cuisine
                checkCuisineCategory(meal_id, cuisine, category);
            }
        })
    }
    document.getElementById("filter_dropdown").style.visibility = "visible";
}
//create a function which sees if a meal id has the right cuisine and category
function checkCuisineCategory(meal_id, cuisine, category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_id}`)
    .then((res) => res.json())
    .then((meal_detail) => {
        if (cuisine == (meal_detail.meals[0]["strArea"])) {
            if (category == (meal_detail.meals[0]["strCategory"])) {
                //if they have the right one, display them 
                console.log(meal_detail.meals[0])
                makeCard(meal_detail.meals[0])
            }
        }
    })
}

//turns the meal option into a card
function makeCard(meal){
    const cardContainer = document.getElementById('meal_opts');
    const card = document.createElement('a');
    card.href = `/recipe_ind.html?id=${meal["idMeal"]}`
    card.classList.add('card');
    let title = meal["strMeal"];
    const cardTitle = document.createElement('h2');
    cardTitle.textContent = title;
    console.log(meal["idMeal"]);
    const cardImg = document.createElement('img');
    cardImg.src = meal["strMealThumb"];
    cardImg.classList.add('cardImg');
    all_meals.push(meal["idMeal"]);
    //create something to remove it by
    card.id = meal["idMeal"];
    console.log(card.id);
    card.appendChild(cardTitle);
    card.appendChild(cardImg);

    cardContainer.appendChild(card)
}

// since coming up with the right main ingredient is difficult, this gives ideas
function getIngRecs() {
    let len = 0;
    let meal_area = document.getElementById("cuisine").value;
    console.log(meal_area, category)
    //get area meal ids
    //search meal name 
    // if the meal category is the same, reccommend the main ingredient
}
let filter_dict;
let all_ing;
let meal_name_id;
function createFilter() {
    //make sure it's empty
    if (reset_filter) {
        console.log(all_meals);
        //create dictionary of ingredients and the meals with it
        filter_dict = {};
        all_ing = [];
        meal_name_id = {};
        all_meals.map((meal_id) => {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_id}`)
            .then((res) => res.json())
            .then((meal_data) => {
                //console.log(meal_data.meals[0])
                for (let i = 1; i < 21; i++) {
                    let meal_main = meal_data.meals[0];
                    meal_name_id[meal_main["strMeal"]] = meal_main["idMeal"]
                    if (meal_main[`strIngredient${i}`]){
                        if (meal_main[`strIngredient${i}`] in filter_dict) {
                            let ing = meal_main[`strIngredient${i}`];
                            console.log(`filter_dict.${ing}`);
                            filter_dict[ing].push(meal_main["strMeal"]);
                        } else {
                            //create the drop down filter with all the check box options
                            let ing = meal_main[`strIngredient${i}`];
                            all_ing.push(ing);
                            filter_dict[ing] = [meal_main["strMeal"]];
                            let a = document.createElement("input");
                            a.type = "checkbox";
                            a.value = ing;
                            a.id = ing;
                            let label = document.createElement("label");
                            label.htmlFor = ing;
                            label.innerHTML = ing;
                            label.classList.add("filter_ing");
                            let div = document.createElement("div");
                            //automatically start with all of them being checked
                            a.checked = "checked";
                            div.classList.add("option_container");
                            div.appendChild(a);
                            div.appendChild(label);
                            //onchange call that function
                            a.addEventListener("change", () => {
                                let change_meals = filter_dict[ing];
                                console.log(filter_dict, ing)
                                //create a function which checks which meals can be made based on the ingredients checked
                                if (!a.checked) {
                                    change_meals.map((meal) => {
                                        card_id = meal_name_id[meal];
                                        console.log(card_id);
                                        document.getElementById("meal_opts").removeChild(document.getElementById(card_id));
                                    })
                                } else {
                                    //iterate through all ingredients to see if the meal can be added back
                                    let can = true;
                                    change_meals.map((meal) => {
                                        for (let [ing, meals] of Object.entries(filter_dict)){
                                            if (meals.includes(meal)) {
                                                if (!document.getElementById(ing).checked){
                                                    can = false;
                                                }
                                            }
                                        }
                                        if (can) {
                                            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_name_id[meal]}`)
                                            .then((res) => res.json())
                                            .then((dt) => makeCard(dt.meals[0]))
                                        }
                                    })

                                }
                            })
                            document.getElementById("ingredient_opts").appendChild(div)
                        }
                        console.log(filter_dict)
                    }
                }
                reset_filter = false;
            })
        })
    }
}
