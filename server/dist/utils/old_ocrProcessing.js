"use strict";
//-------------------extractHospitalName old func-------------
/*
async function extractHospitalName(propertyName: string, Arr: any){
        

  //function for checking if the matched line contains other expected elements

  let matches = [];

  // const namesArr = ['name', 'pt.name', 'pt. name', 'patient name', 'patient' ];

  
  for(let i=0;i<Arr.length; i++){
    if(fullText.description.toLowerCase().includes(Arr[i].toLowerCase().trim())){
      // ////console.log("possibleArr in ocr", possibleArr[i], fullText.description.toLowerCase().indexOf(possibleArr[i].toLowerCase()));
      //Get the vertices of the match
      let match = sortedData.filter((data, index)=>{
        return data.description.toLowerCase() === Arr[i].toLowerCase().trim()
      });
      matches.push(match);
    }
  }
  
  console.log("matches", matches);
  console.log(matches.length);

    
    for(let i = 0; i < matches.length; i++){
      
      if(matches[i][0]){
        let yavg = averageCoord(matches[i][0].boundingPoly,'y');
        let xavg = averageCoord(matches[i][0].boundingPoly,'x');

          let withinY = sortedData.filter(obj =>
            // Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10
            Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10
            );
  
            withinY.sort(function(a, b) {
              return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x');
          });
          console.log(`within y for ${matches[i][0]}`,withinY);

          
          let temp = '';
          let coord = [];
          let isFirst = true;
          for(let j = 0; j<withinY.length; j++){
             ////console.log('coord.length', coord.length, 'elem', withinY[j].description);
             temp += ` ${withinY[j].description}`;
          }

          ocrObj[propertyName] = temp.trim();

          // //console.log(`${lineOrder[elemNum]}: ${temp}`);
          temp = '';
          coord = [];


  }
    }
    
    // //console.log("bioMarkerDataArr", bioMarkerDataArr)
    // ocrObj[propertyName] = bioMarkerDataArr;
    console.log("ocrObj for diffrent properties", ocrObj)
}
*/
//-----------------------------------------------------
//-------------------extractOcrDataBioMarkerNew old func-------------
/*
      async function extractOcrDataBioMarkerNew(propertyName: string){
        
        //creating an array with all the possible test names that could appear in the document
        let tempArr: any = [];
        let testNameArr = testName.map((elem)=>{
          tempArr.push((elem.testName).toLowerCase())
          return tempArr.concat(elem.testScientificName.toLowerCase().split(" "))
        })



        // //console.log("testNameArr", testNameArr)

        //Finding matches for the test name in our document from the possible list of test names and then storing their biomarkers in an array
        let bioMarkerDataAdmin: string | any[] = [];
        for(let i = 0; i < testNameArr.length; i++){
          for(let j = 0; j < testNameArr[i].length; j++){
            if(fullText.description.toLowerCase().includes(testNameArr[i][j].toLowerCase())){
              testName.map((elem)=>{
                // //console.log(elem.testName.toLowerCase() , testNameArr[i][j].toLowerCase())

                if(elem.testName.toLowerCase() === testNameArr[i][j].toLowerCase() || elem.testScientificName.toLowerCase() === testNameArr[i][j].toLowerCase()){
                  // //console.log(elem.testName.toLowerCase() , testNameArr[i][j].toLowerCase())
                  bioMarkerDataAdmin = elem.bioMarkers
                }
                  
              })
              
            }
          }
        }



        const filter = {
          name: { $in: bioMarkerDataAdmin },
          isDeleted: false
        };
      
        const bioMarker = await BioMarker.find(filter);

        // const result = await collection.find(filter).toArray(); .toArray();
        
        // //console.log("matchedBioMarker", matchedBioMarker)
        // //console.log("bioMarkerDataAdmin", bioMarkerDataAdmin)
        let bioMarkerDataAdminArr: any = [];
         let mappingObjArr = [];
         let mappingObj: any = {};
        bioMarkerDataAdmin.map((elem: string)=>{
          // ////console.log("elem", elem)

          let matchedBioMarker: any = bioMarker.filter((subElem)=>{
            // ////console.log("subElem", subElem)
            return subElem.name === elem;
          })
         
          mappingObj[matchedBioMarker[0].name] = matchedBioMarker[0].name;
          let tempArr = matchedBioMarker[0].alias[0].split(",");
          tempArr.map((element: any)=>{
            mappingObj[element.trim()] = matchedBioMarker[0].name;
          })
          tempArr.push((matchedBioMarker[0].name).toLowerCase())
          // let tempArr = (matchedBioMarker[0].name).toLowerCase().concat(matchedBioMarker[0].alias)
          // //console.log("tempArr", tempArr)
          bioMarkerDataAdminArr = bioMarkerDataAdminArr.concat(tempArr)

        })
        bioMarkerDataAdminArr = bioMarkerDataAdminArr.map((elem: string)=>{
          return elem.toLowerCase().trim();
        })
        bioMarkerDataAdminArr = [...new Set(bioMarkerDataAdminArr)]
        //console.log("mappingObj", mappingObj)


//function for finding elements in the same line
      function findElementsInSameLine(searchStrings: string[]): any[] {
        let result: any[] = [];

        for (const string of searchStrings) {
            for (const data of sortedData) {
                if (data.description.toLowerCase() === string) {
                    let lineData: any[] = [];
                    const y = averageCoord(data.boundingPoly, 'y');
                    for (const d of sortedData) {
                        if (Math.abs(averageCoord(d.boundingPoly, 'y') - y) <= 10) {
                            lineData.push(d);
                        }
                    }
                    result = lineData.sort((a, b) => a.boundingPoly.vertices[0].x - b.boundingPoly.vertices[0].x);
                }
            }
        }

        return result;
      }

      //Finding the results, units, range line
      const searchStrings: string[] = ['result', 'observation', 'observed'];
      const result = findElementsInSameLine(searchStrings);

      //console.log('result', result);

      let rangeVals: string[] = ['range', 'ref', 'interval', 'biological', 'value', 'reference', 'normal values'];

      //function for checking if the matched line contains other expected elements
      function hasMatch(objectsArray: any[], searchStrings: string[]): boolean {
        for (const data of objectsArray) {
          if (searchStrings.includes(data.description.toLowerCase())) {
            return true;
          }
        }
        return false;
      }
      //Double checking if we're in the right line
      if (hasMatch(result, rangeVals)) //console.log('Right line');

      rangeVals = ['range', 'ref', 'interval', 'reference', 'biological', 'normal values'];
      const resultVals: string[] = ['result', 'observation', 'value', 'observed'];
      const unitVals: string[] = ['units', 'unit'];

      const findMatchedIndex = (arr: any[], searchArr: string[]): number[] => {
        const matchedIndex: number[] = [];
        for (let i = 0; i < arr.length; i++) {
          if (searchArr.includes(arr[i].description.toLowerCase())) {
            matchedIndex.push(i);
          }
        }
        return matchedIndex;
      };

      const rangeMatches = findMatchedIndex(result, rangeVals);
      const resultMatches = findMatchedIndex(result, resultVals);
      const unitMatches = findMatchedIndex(result, unitVals);
      
      //console.log("Range matches:", rangeMatches.join());
      //console.log("Result matches:", resultMatches.join());
      //console.log("Unit matches:", unitMatches.join());
      
      interface Order {
        range?: any;
        result?: any;
        unit?: any;
      }
      
      const orderObj: Order = {} ;
      if(rangeMatches.length > 0){
        orderObj.range = parseInt(rangeMatches.join(), 10)
      }
      if(resultMatches.length > 0){
        orderObj.result = parseInt(resultMatches.join(), 10)
      }
      if(unitMatches.length > 0){
        orderObj.unit = parseInt(unitMatches.join(), 10)
      }
      
      //console.log(orderObj);
      const sortedObj = Object.entries(orderObj).sort((a, b) => a[1] - b[1]).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      //console.log(sortedObj);
      let lineOrder = Object.keys(sortedObj);
      console.log("lineOrder", lineOrder);
      //Here we have the order in which the results, units, range appear in our document
  
      
      //Matching all the ocuurences of BioMarkers in Ocr Document
      let matches = [];
      
      for(let i=0;i<bioMarkerDataAdminArr.length; i++){
        if(fullText.description.toLowerCase().includes(bioMarkerDataAdminArr[i].toLowerCase().trim())){
          // ////console.log("possibleArr in ocr", possibleArr[i], fullText.description.toLowerCase().indexOf(possibleArr[i].toLowerCase()));
          //Get the vertices of the match
          let match = sortedData.filter((data, index)=>{
            return data.description.toLowerCase() === bioMarkerDataAdminArr[i].toLowerCase().trim()
          });
          matches.push(match);
        }
      }
      

        let bioMarkerDataArr = [];
        
        for(let i = 0; i < matches.length; i++){

          let bioMarkerDataObj: any = {};
          let innerObj: any = {};
          
          if(matches[i][0]){
            let yavg = averageCoord(matches[i][0].boundingPoly,'y');
            let xavg = averageCoord(matches[i][0].boundingPoly,'x');
            
            const withinY = sortedData.filter(obj =>
              Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= 10
              );
            
              withinY.sort((a,b)=>{
                return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x')
              })
              console.log(`within y for`,withinY);

              if(mappingObj[matches[i][0].description]){
                bioMarkerDataObj[mappingObj[matches[i][0].description]] = innerObj;
              } else{
                bioMarkerDataObj[matches[i][0].description] = innerObj;
              }
              
              let temp = '';
              let coord = [];
              let bioMarkersVal:any = {};
              let elemNum =0;
              let isFirst = true;
              for(let j = 0; j<withinY.length; j++){
              //   if (j === 0 && (withinY[1].description === '%' || withinY[1].description === '#')) {
              //     continue;
              // }
                 ////console.log('coord.length', coord.length, 'elem', withinY[j].description);
                if(coord.length>0){
                  if(withinY[j].boundingPoly.vertices[0].x - coord[1].x <= 8){
                    console.log(`${temp}` + `${withinY[j].description}`);
                    temp += withinY[j].description;
                    coord = withinY[j].boundingPoly.vertices;
                  }
                  else{
                    
                    if(!isFirst){
                      
                      innerObj[lineOrder[elemNum]] = temp;
                      console.log(`${lineOrder[elemNum]}: ${temp}`);
                      temp = withinY[j].description;
                      coord = withinY[j].boundingPoly.vertices;

                      elemNum++;
                    } else{
                      temp = withinY[j].description;
                      coord = withinY[j].boundingPoly.vertices;
                      isFirst = false;
                    }
                    // innerObj[lineOrder[elemNum]] = temp;
                    // innerObj[]


                  }
                }else{
                  ////console.log(`setting temp ${withinY[j].description}`);
                  console.log(`checking for ${lineOrder[elemNum]}`);
                  temp = withinY[j].description;
                  coord = withinY[j].boundingPoly.vertices;
                }
              }
              innerObj[lineOrder[elemNum]] = temp;
              console.log(`${lineOrder[elemNum]}: ${temp}`);
              temp = '';
              coord = [];

              // ////console.log(bioMarkerDataObj.data[i][0].description, bioMarkerDataObj[data[i][0].description], )
              // if(bioMarkerDataObj.data[i][0].description.lineOrder[0]){
                bioMarkerDataArr.push(bioMarkerDataObj);
              // }
              
              
      }
        }
        
        // //console.log("bioMarkerDataArr", bioMarkerDataArr)
        ocrObj[propertyName] = bioMarkerDataArr;
        // //console.log("ocrObj", ocrObj)
      }
*/
//-----------------------------------------------------
//-------------------extractOcrData old func-------------
/*
      function extractOcrData(possibleArr: string | any[], objName: string, x_coordGap: number, y_coordGap: number){
        ////console.log("possibleArr", possibleArr)

        matches = [];
        //Look for matches from possible values for field in sorted data and add to to matches
        for(let i = 0; i<possibleArr.length; i++){
          if(fullText.description.toLowerCase().includes(possibleArr[i])){
              // ////////console.log(namesArr[i], fullText.description.toLowerCase().indexOf(namesArr[i].toLowerCase());
              //Get the vertices of the match
               let match = sortedData.filter((item)=>{
                  return item.description.toLowerCase() === possibleArr[i].toLowerCase();
              });
              ////////console.log('dat is', dat);
              matches.push(match);
          }
      }
      
      //console.log("matches", matches);
      
      //If there are no matches, return from the execution of function
      if(matches.length === 0 || Object.keys(matches[0]).length === 0){
        return;
      }
      
      let yavg = averageCoord(matches[0][0].boundingPoly,'y');
      let xavg = averageCoord(matches[0][0].boundingPoly,'x');
      ////////console.log(yavg, xavg);
      
      //Getting the elements in the same line of the match
      let withinY: any = sortedData.filter(obj =>
          Math.abs(averageCoord(obj.boundingPoly,'y') - yavg) <= y_coordGap && obj.description !== ":" && obj.description.toLowerCase() !== "mr." && obj.description.toLowerCase() !== "mrs." && obj.description.toLowerCase() !== "ms."
          );

      withinY.sort(function(a: any, b: any) {
        return averageCoord(a.boundingPoly, 'x') - averageCoord(b.boundingPoly, 'x');
      });
      console.log('withiny',withinY);
      //Getting the elements that is in proximity to the same line item match
      let withinXY = withinY.filter((obj: any) =>
            (averageCoord(obj.boundingPoly,'x') - xavg) <= x_coordGap && (averageCoord(obj.boundingPoly,'x') >= xavg)
          );
      
      //Get the adjacent elements and adding it to the object property as a string
      let allData = withinXY.map((obj: any)=> {if(obj.description.toLowerCase()!= matches[0][0].description) return obj.description});
      //////console.log(allData);
      if(objName !== "lab"){
        allData.splice(allData.indexOf(matches[0][0].description), 1);
      }
      ocrObj[objName] = allData.join(' ');
      
      // //////console.log(ocrObj);
      
      
      }
*/
//-----------------------------------------------------
