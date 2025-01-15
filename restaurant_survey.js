//create an object for each card and just make an html div, so that you don't get the fetch error
//&page=1
//dt.data.data[i].name*/
// Assume data.json is in the same directory as your HTML/JavaScript file 


/////3323314 - greater sydney
//255060 - sydney - done data
//show all of this in the cards as well, start with all of the cards, and filter - show its ranking and if its open
//open times
//contact info
//dietary friendlyness
//meal categories - eg lunch, dinner
//show specific location
//view online menu
//have a select all feature

//open thing can only be called with the direct api not with pre held information
//min amount of ratings
//average rating
//is premium
//offers delivery reservation or special offers
//prive tag
//food type tags
//myb specifc location since there are outlets 
let filtered_data;
fetch('data.json')
    .then(response => response.json())
    .then(data => 
		{
			let tags = [];
			for (let i = 0; i < 4470; i++) {
				//say "please select some of the other options before selecting tags"
					//console.log(data[i].establishmentTypeAndCuisineTags, data[i].name)
					//if (data[i].awardInfo) {
						//console.log(data[i].priceTag)
					//}
					data[i].establishmentTypeAndCuisineTags.map(tag => {
						if (!(tags.includes(tag))) {
							tags.push(tag)
						}
					})
					//console.log(data[i].offers.restaurantSpecialOffer)
			}
			//console.log(tags)
		})
//create an array that keeps getting filtered through based on the options picked
//price filter
function price_val() {
	let price_val = document.getElementById("price_val");
	let num = document.getElementById("price_input").value
	price_val.innerHTML = "";
	
	for (let i = 0; i < num; i++){
		price_val.innerHTML += "$";
	};
}
function price_visible() {
	let matter = document.getElementById("price_matter");
	if (matter.checked) {
		document.getElementById("price").style.visibility = "hidden"
	} else {
		document.getElementById("price").style.visibility = "visible"
	}
}
function rating_visible() {
	let matter = document.getElementById("rating_matter");
	if (matter.checked) {
		document.getElementById("rating").style.visibility = "hidden"
	} else {
		document.getElementById("rating").style.visibility = "visible"
	}
}
//Rating filter
function rating_val() {
	let rating_val = document.getElementById("rating_val");
	rating_val.innerHTML = document.getElementById("rating_input").value;
}
//hit enter to show cards
function filter() {
	fetch('data.json')
	.then(res => res.json())
	.then(data => {
		filtered_data = data;
		//price range val
		if (!document.getElementById("price_matter").checked){
			filtered_data = filtered_data.filter(function(item) {
				if (item.priceTag) {
					return (item.priceTag.includes(document.getElementById("price_val").innerHTML))
				} else false
		})
		console.log(filtered_data.length)
		} if (document.getElementById("award_check").checked){
			//award winner filter
			filtered_data = filtered_data.filter(function(item) {
				return item.awardInfo
			})
			console.log(filtered_data.length)
		} if (!document.getElementById("rating_matter").checked) {
			//min rating val
			filtered_data = filtered_data.filter(function(item) {
				return (item.averageRating >= document.getElementById("rating_input").value)
			})
			console.log(filtered_data.length)
		} if (document.getElementById("min_review").value > 0) {
			//min review amount
			//check if this works
			filtered_data = filtered_data.filter(function(item) {
				return (item.userReviewCount >= document.getElementById("min_review").value)
			})
			console.log(filtered_data.length)
		} if (document.getElementById("delivery").checked){
			filtered_data = filtered_data.filter(function(item) {
				return (item.offers.hasDelivery)
			})
		} if (document.getElementById("reservation").checked){
			filtered_data = filtered_data.filter(function(item) {
				return (item.offers.hasReservation)
			}) 
		} 
	console.log(filtered_data)
	filtered_data.map(item => createCard(item))
}) 
}
//make card
function createCard(data){
	const cardContainer = document.getElementById('rest_opts');
    const card = document.createElement('a');
    //card.href = `/rest_ind.html?id=${meal["idMeal"]}`
    card.classList.add('card');
	card.href = `/rest_ind.html?id=${data.restaurantsId}`
	let tag = document.createElement("p");
	tag.classList.add('tag');
	tag.innerHTML = data.priceTag;
    let title = data.name;
    const cardTitle = document.createElement('h2');
    cardTitle.textContent = title;
    const cardImg = document.createElement('img');
    cardImg.src = data.squareImgUrl;
	cardImg.alt = "No image"
    cardImg.classList.add('cardImg');
    //create something to remove it by
    card.id = data.restaurantsId;
	
    card.appendChild(cardTitle);
    card.appendChild(cardImg);
	card.appendChild(tag)

    cardContainer.appendChild(card)
}
//food type filter accordingly
function tag_filter(){
	let tags = {};
	filtered_data.map((data) => {
		console.log(data.establishmentTypeAndCuisineTags)
		let id = data.restaurantsId;
		data.establishmentTypeAndCuisineTags.map((tag) => {
			//console.log(filtered_data[data].establishmentTypeAndCuisineTags[tag])
			console.log(tags[tag])
			if (!(tags[tag])) {
				console.log("here");
				Object.assign(tags, {[tag]: [id]})
			} else {
				console.log(tags[tag], "here")
				tags[tag].push(data.restaurantsId)
			}
		})
	})
	console.log(tags)
	//go through tags and add it as a checkbox
	Object.keys(tags).map((tag) => {
		let a = document.createElement("input");
		a.type = "checkbox";
		a.value = tag;
		a.id = tag;
		let label = document.createElement("label");
        label.htmlFor = tag;
        label.innerHTML = tag;
        let div = document.createElement("div");
		
        //automatically start with all of them being checked
        a.checked = "checked";
		//create the event listener that makes the change happen when the checkbox value changes
		a.addEventListener("change", () => {
			let ids = tags[a.value];
			if (!a.checked) {
				ids.map((id) => document.getElementById("rest_opts").removeChild(document.getElementById(id)))
			} else {
				fetch('data.json')
				.then(res => res.json())
				.then((data) => {
					ids.map((id) => {
						console.log(id);
						for (let i = 0; i < 4470; i++){
							let item = data[i]
							if (item.restaurantsId == id){
								console.log(item)
								createCard(item);
							}
						}
					})	
				})
					
			}
		})
        div.appendChild(a);
        div.appendChild(label);
		//create the event listener that makes the change happen when the checkbox value changes
		document.getElementById("filter_opts").appendChild(div)
	})
	
}
//dont keep adding the tags again and again, when it's already there
//empty filter everytime enter is clicked again
