import pdfjsDist from "pdfjs-dist";
import { clearTableOutput, clearStatsOutput } from "./looks.js";

// upload file handler
export function parseFile(event) {
  return new Promise((resolve, reject) => {
    // set the worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.min.mjs";

    // get file
    const file = event.target.files[0];

    // verify that file is pdf
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      reject("File is not a PDF.");
      return;
    }

    // clear output
    clearTableOutput();
    clearStatsOutput();

    // new file reader
    const reader = new FileReader();

    // when file successfully read
    reader.onload = function (event) {
      // store raw binary data of file
      const typedarray = new Uint8Array(event.target.result);

      // get pdf from raw binary data
      pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
        // initializes array to hold promises for each page
        const pagesPromises = [];

        // extract room + room infos
        const rooms = [];
        let roomsInfoList = [];

        // don't remove if
        // not whitespace and not any of following:
        // 'College'
        // 'Building'
        // 'Room'
        // 'Type'
        // 'Sq. Ft.'
        // 'Updated'
        function noRemove(item) {
          const str = item.str.toLowerCase().trim();

          // Remove whitespace or exact match "college"
          if (!str || str == "college") return false;

          // Remove other blocked words
          const blockedWords = [
            "building",
            "dorm",
            "room",
            "type",
            "square",
            "sq. ft.",
            "sq ft",
            "foot",
            "feet",
            "independent",
            "updated",
            "you",
          ];

          return !blockedWords.some((word) => str.includes(word));
        }

        // iterate through each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          // keep track of promises for each page (when each page gets retrieved)
          pagesPromises.push(
            pdf.getPage(pageNum).then(function (page) {
              // get text content of each page
              return page.getTextContent().then(function (textContent) {
                // extract relevant room info
                const roomsInPage = textContent.items
                  .filter(noRemove)
                  .map((item) => item.str)
                  .filter((item) => item !== "");

                // organize room info
                let room = {};
                for (let i = 0; i < roomsInPage.length; i++) {
                  if (i % 5 === 0) {
                    room = {};
                    rooms.push(room);
                    room["college"] = roomsInPage[i];
                  } else if (i % 5 === 1) {
                    room["building"] = roomsInPage[i];
                  } else if (i % 5 === 2) {
                    room["room"] = roomsInPage[i];
                  } else if (i % 5 === 3) {
                    room["type"] = roomsInPage[i];
                  } else {
                    room["sqft"] = roomsInPage[i];
                  }
                }
                roomsInfoList = roomsInfoList.concat(roomsInPage);
              });
            }),
          );
        }

        // when all pages processed
        Promise.all(pagesPromises)
          .then(function () {
            console.log("All pages processed");
            resolve(rooms);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    // read file to trigger load even when read complete
    reader.readAsArrayBuffer(file);
  });
}
