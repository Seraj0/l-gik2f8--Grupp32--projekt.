const express = require("express"); // Importerar express-biblioteket
const app = express(); // Skapar en ny express-applikation
const fs = require("fs/promises"); // Importerar fs-biblioteket med promises-stöd

const PORT = 5000; // Definierar vilken port som ska användas för att lyssna på anslutningar



app
// för att kunna hantera JSON-data i själva bodyn.
	.use(express.json()) 
// samma sak här express hanterar urlencoded-data i req.body.
	.use(express.urlencoded({ extended: false }))
// detta använder vi för att backend ska kunna kommunicera med frontend.
	.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "*");
		res.header("Access-Control-Allow-Methods", "*");

		next();
	});

// CRUD-operationer.

// HTTP-metoden GET för att läsa av listan 
app.get("/tasks", async (req, res) => {
	// try och catch för enkel felhantering inut callback-funktionen.
	try {
// FS biblan för att kunna läsa av innehållet  
		const tasks = await fs.readFile("./tasks.json");
// Parse för att kunna hantera innhållet vidare som JS objekt
		res.send(JSON.parse(tasks));
// om fel uppstår så skickas statuskod 500 och ett felmeddelande 
	} catch (error) {
		res.status(500).send({ error });
	}
});

// POST-metoden för att kunna lägga till böckera i listan 
app.post("/tasks", async (req, res) => {
	try {
		const task = req.body;

		const listBuffer = await fs.readFile("./tasks.json");

		const currentTasks = JSON.parse(listBuffer);
		let maxTaskId = 1;
/*en If-sats som säger om det finns något i currentTasks(innhåll) som är större än 0 så ska en
 ID tilldelas beroende på de som redan finns i filen */
		if (currentTasks && currentTasks.length > 0) {
			maxTaskId = currentTasks.reduce(
				(maxId, currentElement) =>
					currentElement.id > maxId ? currentElement.id : maxId,
				maxTaskId
			);
		}
		const newTask = { id: maxTaskId + 1, ...task };
		const newList = currentTasks ? [...currentTasks, newTask] : [newTask];

		await fs.writeFile("./tasks.json", JSON.stringify(newList));

		res.send(newTask);
	} catch (error) {
		res.status(500).send({ error: error.stack });
	}
});

// Delete för att kunna ta bort ifrån listan sedan har vi Task/id för att den ska tabort via ID.
app.delete("/tasks/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const listBuffer = await fs.readFile("./tasks.json");
		const currentTasks = JSON.parse(listBuffer);
// IF-satasen här kollar genom listan så den inte är tom, ifall att den är tom så skickas felmeddelandet annars uppdateras listan.
		if (currentTasks.length > 0) {
			await fs.writeFile(
				"./tasks.json",
				JSON.stringify(currentTasks.filter((task) => task.id != id))
			);

			res.send({ message: `Uppgift med id ${id} togs bort` });
		} else {
			res.status(404).send({ error: "Ingen uppgift att ta bort" });
		}
	} catch (error) {
		res.status(500).send({ error: error.stack });
	}
	
});

// Metoden patch för att uppdatera på listan utan att ta bort den helt.
app.patch("/tasks/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const listBuffer = await fs.readFile("./tasks.json");
		const currentTasks = JSON.parse(listBuffer);
// om boken är klar läst så ändras Completed till true, annars tvärtom.
// true = det stryks på den samt hamnar längst ner i listan.
		currentTasks.forEach((task) => {
			if (task.id == id && task.completed == false) {
				task.completed = true;
			} else if (task.id == id && task.completed == true) {
				task.completed = false;
			}
		});
		await fs.writeFile("./tasks.json", JSON.stringify(currentTasks));
		res.send({ message: "Task with ${id} is updated" });
	} catch (error) {
		res.status(500).send({ error: error.stack });
	}
});

// startar HTTP-servern port 5000, när allt har startat rätt skrivs server running on http://localhost:5000 på Terminalen.
app.listen(PORT, () => console.log("server running on  http://localhost:5000"));