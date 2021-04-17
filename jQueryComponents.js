$(document).ready(function () {
  $.getJSON("jqueryassignmentdummydata.json", function (data) {
    $.each(data, function (i, val) {
      //val: every object in JSON array
      //2. cache JSON object to local storage: we want
      localStorage.setItem(i, JSON.stringify(val));
    });
  });

  // to get object value
  // var obj = JSON.parse(localStorage.getItem(0));
  // console.log("obj:", obj.firstname);

  //default display
  display(10);

  //update table when display changes
  $("#displayRow").change(function () {
    $("tbody").empty(); //clear previous table
    var DisplayNum = $("#displayRow option:selected").text();
    display(DisplayNum);
  });
});

function display(DisplayNum) {
  $.getJSON("jqueryassignmentdummydata.json", function (data) {
    //1. getJASON can ajax load Json data
    $.each(data, function (i, val) {
      DisplayNum = DisplayNum === undefined ? 10 : DisplayNum;
      //only display certain number
      if (i > DisplayNum) {
        return;
      }
      //get key-val entry from object address & marks
      let addressVal = [];
      let markVal = [];
      for (let addrKey in val.address) {
        addressVal.push(addrKey + ": " + val.address[addrKey]);
      }
      for (let markKey in val.marks) {
        markVal.push(markKey + ": " + val.marks[markKey]);
      }

      //display table elements using JSON data
      $("table tbody").append(
        "<tr><td>" +
          val.firstname +
          "</td> <td>" +
          val.lastname +
          "</td> <td> " +
          val.email +
          "</td> <td>" +
          val.location +
          "</td> <td>" +
          val.phone +
          "</td><td>" +
          addressVal +
          "</td><td>" +
          markVal +
          "</td>  </tr > "
      );

      // //3. Stringfy the JSON object
      // console.log(JSON.stringify(val));
    });
  });
}
