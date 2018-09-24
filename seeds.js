var mongoose  = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");



var data= [
			{	name:"Mirzapur",
			image:"http://tourmet.com/wp-content/uploads/2014/03/Devdari_Fall-mirzapur.jpg",
			des:"Mirzapur is located in the Indian state of Uttar Pradesh. This town is a very popular tourist destination located in a district of the same name. Mirzapur is often visited by locals and tourists alike, and the main attractions in this town are its various temples. There are many beautiful spots in Mirzapur, that you can see during your stay in the city too. The river Ganges flows through the town too, bringing along an air of calm to the place.You can visit the Chunar fort during your trip to the town of Mirzapur. This fort is a very popular tourist destination that was built by the Kind Vikramaditya. This fort is a must visit destination that has enormous historial significance and history buffs will love this place. You can visit the Vindhyachal temple during your trip to the town of Mirzapur, and this is a famous religious destination in the place. Pilgrims from around the region flock to this temple, and many tourists can be spotted here too, gazing at the architectural brilliance of the place. You can also take time off to visit Lekhania Dari, which is a place located in the forest region. This place has many wall paintings that are ancient and are a sight to behold. Kali Khoh is also a must visit location in Mirzapur. The climate that the region of Mirzapur experiences is sub tropical, and the basic seasons are those of summer, winter and monsoon. The summer season in Mirzapur is very dry, and temperatures escalate during this time. Winters in Mirzapur are very dry and very cold. The monsoon season in Mirzapur brings along heavy rainfall."		},
			{	name:"Varansai",
			image:"https://media.gettyimages.com/photos/evening-at-varanasi-picture-id610625330",
			des:"Varanasi, once known as Benares or Banaras and Kashi, is a historical city in northern India. The city is sacred to Hindus and Jains and also one of the oldest continuously inhabited cities in the world, with settlements dating back to the 11th century BC. Many Hindus believe that dying in Varanasi brings salvation/nirvana and so they make the trip to the city when they realize that they are close to death. For some, the culture shock of the burning corpses in plain view can be a bit overwhelming. However, the scene of pilgrims doing their devotions in the River Ganga at sunrise set against the backdrop of the centuries old temples is probably one of the most impressive sights in the world.The city can be scorchingly hot in the summer months so, if possible, time your visit to fall between October and March, and bring something warm to wear for chilly days and nights. "	},
			{	name:"Assam",
			image:"http://www.incredible-northeastindia.com/images/assam-head.jpg",
			des:"Assam, a celestial tourist destination has a lot of overwhelming attractions to offer to travellers. It is endowed with sheer greenery as if a symbol of divine perfection. Nature has fashioned this land to resemble a green carpet. It is a land of undulating plains and thick forest. It is a beautiful north eastern state of India surrounded by Nagaland, Manipur, Mizoram, Meghalaya, Bengal and Bangladesh. Originating from Tibet the Brahmaputra river makes its way into Assam. The history of Assam dates back to the stone age. The mention of its history is found in Tantric literature, Buddhist literature, Assamese folklore and Vedic literature."	},
			{	name:"Odisha",
			image:"https://swantours.files.wordpress.com/2017/05/odisha.jpg",
			des:"Odisha formerly Orissa,is one of the 29 states of India, located in eastern India. It is surrounded by the states of West Bengal to the north-east, Jharkhand to the north, Chhattisgarh to the west and north-west, and Andhra Pradesh to the south. Odisha has 485 kilometres (301 mi) of coastline along the Bay of Bengal on its east, from Balasore to Ganjam.It is the 9th largest state by area, and the 11th largest by population. It is also the 3rd most populous state of India in terms of tribal population. Odia (formerly known as Oriya) is the official and most widely spoken language, spoken by 33.2 million according to the 2001 Census."	},
			{	name:"Punjab",
			image:"https://static1.squarespace.com/static/552bd209e4b0090163821585/t/5a9458e1c830257a34c00cca/1519671526948/Punjab.jpg?format=750w",
			des:"Punjab is a state in northern India that shares an international border with Pakistan and internal borders with the states of Jammu and Kashmir, Himachal Pradesh, Haryana, and Rajasthan. It also shares the city of Chandigarh, a union territory, as its state capital with its neighboring state of Haryana.. Present day Punjab, as it is organized today in India, also does not share the same boundaries as the Punjab of 1947. Most parts of modern day Punjab would fall under the state known as East Punjab, which included the complete state of modern day Haryana as well as parts of Himachal Pradesh. The state would gradually morph into its current day boundaries by 1966 however."	}
		];

function seedDb(){
	Campground.remove({},function(err){
			if(err){
				console.log(err);
			}
				console.log("All Campgrounds Deleted");
				data.forEach(function(seed){
					Campground.create(seed,function(err,campground){
						if(err){
							console.log(err);
						}
						else{
							console.log("Camp Added");
							Comment.create({
								text:"Yes its a very nice place",
								author:"Anuj"
							},function(err,comment){
								if(err){
									console.log(err);
								}
								else{
									campground.comments.push(comment);
									campground.save();
									console.log("Comment Added");
								}
							});
						}
					});
				});
	});
};

module.exports = seedDb;