{
	"translatorID": "bc03b4fe-436d-4a1f-ba59-de4d2d7a63f7",
	"label": "CSL JSON",
	"creator": "Simon Kornblith",
	"target": "json",
	"minVersion": "4.0.27",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 3,
	"browserSupport": "gcsibv",
	"lastUpdated": "2017-06-03 11:41:00"
}

function parseInput() {
	var str, json = "";
	
	// Read in the whole file at once, since we can't easily parse a JSON stream. The 
	// chunk size here is pretty arbitrary, although larger chunk sizes may be marginally
	// faster. We set it to 1MB.
	while((str = Z.read(1048576)) !== false) json += str;
	
	try {
		return JSON.parse(json);
	} catch(e) {
		Zotero.debug(e);
	}
}

function detectImport() {
	const CSL_TYPES = {"article":true, "article-journal":true, "article-magazine":true,
		"article-newspaper":true, "bill":true, "book":true, "broadcast":true,
		"chapter":true, "dataset":true, "entry":true, "entry-dictionary":true,
		"entry-encyclopedia":true, "figure":true, "graphic":true, "interview":true,
		"legal_case":true, "legislation":true, "manuscript":true, "map":true,
		"motion_picture":true, "musical_score":true, "pamphlet":true,
		"paper-conference":true, "patent":true, "personal_communication":true,
		"post":true, "post-weblog":true, "report":true, "review":true, "review-book":true,
		"song":true, "speech":true, "thesis":true, "treaty":true, "webpage":true};
		
	var parsedData = parseInput();
	if(!parsedData) return false;
	
	if(typeof parsedData !== "object") return false;
	if(!(parsedData instanceof Array)) parsedData = [parsedData];
	
	for(var i=0; i<parsedData.length; i++) {
		var item = parsedData[i];
		if(typeof item !== "object" || !item.type || !(item.type in CSL_TYPES)) {
			return false;
		}
	}
	return true;
}

function doImport() {
	var parsedData = parseInput();
	if(!parsedData) return;
	if(!Array.isArray(parsedData)) parsedData = [parsedData];
	
	for(var i=0; i<parsedData.length; i++) {
		var item = new Z.Item();
		ZU.itemFromCSLJSON(item, parsedData[i]);
		item.complete();
	}
}

function doExport() {
	var item, data = [];
	while(item = Z.nextItem()) data.push(ZU.itemToCSLJSON(item));
	Z.write(JSON.stringify(data, null, "\t"));
}
/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "import",
		"input": "[\n\t{\n\t\t\"id\": \"http://zotero.org/users/96641/items/BDQRTS3T\",\n\t\t\"type\": \"book\",\n\t\t\"title\": \"Stochastic biomathematical models: With applications to neuronal modeling\",\n\t\t\"collection-title\": \"Lecture notes in mathematics\",\n\t\t\"publisher\": \"Springer\",\n\t\t\"publisher-place\": \"Heidelberg\",\n\t\t\"volume\": \"2058\",\n\t\t\"number-of-pages\": \"206\",\n\t\t\"event-place\": \"Heidelberg\",\n\t\t\"ISBN\": \"978-3-642-32156-6\",\n\t\t\"language\": \"en\",\n\t\t\"author\": [\n\t\t\t{\n\t\t\t\t\"family\": \"Bachar\",\n\t\t\t\t\"given\": \"Mostafa\"\n\t\t\t}\n\t\t],\n\t\t\"issued\": {\n\t\t\t\"date-parts\": [\n\t\t\t\t[\n\t\t\t\t\t\"2013\",\n\t\t\t\t\t1,\n\t\t\t\t\t1\n\t\t\t\t]\n\t\t\t]\n\t\t}\n\t}\n]",
		"items": [
			{
				"itemType": "book",
				"title": "Stochastic biomathematical models: With applications to neuronal modeling",
				"creators": [
					{
						"lastName": "Bachar",
						"firstName": "Mostafa",
						"creatorType": "author"
					}
				],
				"date": "January 1, 2013",
				"ISBN": "978-3-642-32156-6",
				"itemID": "http://zotero.org/users/96641/items/BDQRTS3T",
				"language": "en",
				"numPages": "206",
				"place": "Heidelberg",
				"publisher": "Springer",
				"series": "Lecture notes in mathematics",
				"volume": "2058",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/