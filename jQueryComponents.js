$(document).ready(function () {
  $.getJSON("jqueryassignmentdummydata.json", function (data) {
    var arr = [];
    $.each(data, function (i, val) {
      //val: every object in JSON array
      arr.push(val);
    });
    //2. cache JSON object to local storage: we want
    localStorage.setItem("studentData", JSON.stringify(arr));
  });

  // to get object value
  // localStorage.setItem("dataLen", 12);
  // var obj = JSON.parse(localStorage.getItem(0));
  // console.log("obj:", obj.firstname, "length", localStorage.getItem("dataLen"));

  //default display
  display(10);

  //update table when display changes
  $("#displayRow").change(function () {
    reloadTable();
  });
});

//field to add student record to the local storage: address ==> drag drop multiple input
function addRecord() {
  //get all students input
}

function display(DisplayNum) {
  DisplayNum = DisplayNum === undefined ? 10 : DisplayNum;
  var arr = JSON.parse(localStorage.getItem("studentData"));

  //contruct table view
  for (let i = 0; i < DisplayNum; i++) {
    let val = arr[i];

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
      "<tr id ='row" +
        i +
        "' class = 'tbRow'><td id='fn" +
        i +
        "'>" +
        val.firstname +
        "</td> <td id='ln" +
        i +
        "'>" +
        val.lastname +
        "</td> <td id='email" +
        i +
        "'> " +
        val.email +
        "</td> <td id='location" +
        i +
        "'>" +
        val.location +
        "</td> <td id='phone" +
        i +
        "'>" +
        val.phone +
        "</td><td  id='addr" +
        i +
        "'>" +
        addressVal +
        "</td><td class = 'markOption' id='mark" +
        i +
        "'>" +
        markVal +
        "</td>" +
        "<td><button id ='showMore_btn" +
        i +
        "' onclick= 'showMore_row(" +
        i +
        ")'> More details </button> </td> " +
        "<td><button class ='editBtn' id ='edit_btn" +
        i +
        "' onclick= 'edit_row(" +
        i +
        ")'> Edit </button> </td> " +
        "<td><button class = 'saveBtn' id ='save_btn" +
        i +
        "' onclick= 'save_row(" +
        i +
        ")'> Save </button> </td> " +
        "<td> <button  class ='deleteBtn' onclick= 'delete_row(" +
        i +
        ")'> delete </button> </td>" +
        "</tr > "
    );

    $(".saveBtn").hide();

    //hide marks
    $(".markOption").hide();
    $("#markField").hide();
  }
}

function showMore_row(i) {
  $("#markField").show();
  $("#mark" + i).show();
  $("#showMore_btn" + i).hide();
}

//edit the table record for row i
function edit_row(i) {
  $(".saveBtn").show();
  $(".editBtn").hide();

  //set current row's content ==> input
  let fn = $("#fn" + i).html();
  // var ln = $("#ln " + i).html();
  // var email = $("#email " + i).html();
  // var location = $("#location" + i).html();
  // var phone = $("#phone " + i).html();
  // var addr = $("#addr " + i).html();
  // var mark = $('#mark' + i).html();

  //create a new content for table row
  $("#fn" + i).html(
    "<input type='text' id='fn_text" + i + "' value = '" + fn + "'> "
  );
}

//also save to the localStorage
function save_row(i) {
  $(".saveBtn").hide();
  $(".editBtn").show();

  //get data from user input(new table row) --> current display
  let fn = $("#fn_text" + i).val();

  $("#fn" + i).html(fn);

  //save new record to local storage
  var arr = JSON.parse(localStorage.getItem("studentData"));
  arr[i].firstname = $("#fn" + i).text();
  localStorage.setItem("studentData", JSON.stringify(arr));
}

//remove in local storage
function delete_row(i) {
  $("#row" + i).hide();
  var arr = JSON.parse(localStorage.getItem("studentData"));
  //delete record in storage & update table
  arr.splice(i, 1);
  localStorage.setItem("studentData", JSON.stringify(arr));
  reloadTable();
}

//reload table view after changes
function reloadTable() {
  $("tbody").empty(); //clear previous table
  var DisplayNum = $("#displayRow option:selected").text();
  display(DisplayNum);
}

function getStorageData() {
  return JSON.parse(localStorage.getItem("studentData"));
}

function SetStorageData(arr) {
  localStorage.setItem("studentData", JSON.stringify(arr));
  return;
}
