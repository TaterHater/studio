const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get a reference to the Firestore database
const db = admin.firestore();
const trainLines = ["A", "B", "C", "D", "E", "G", "H", "L", "N", "R", "W"];

exports.getTrainData = functions.https.onRequest(
  async (req = trainLines, res) => {
    trainLines.map(async (line) => {
      try {
        const response = await fetch(
          `https://nodejs-prod.rtd-denver.com/api/v2/nextride/routes/${line}/vehicles`
        );
        const data = await response.json();
        // Add/update documents in Firestore
        const batch = db.batch();
        const trainCollectionRef = db.collection("train-data");

        data.forEach((train) => {
          const trainRef = trainCollectionRef.doc(train.id);
          batch.set(trainRef, train);
        });
        await batch.commit();

        res.status(200).send("Train data fetched and saved successfully!");
      } catch (error) {
        console.error("Error fetching train data:", error);
        res.status(500).send("Error fetching train data");
      }
    });
  }
);
