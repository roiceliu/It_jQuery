var dropedVal = [];
var curr_idx = 0;
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

  //search the record
  searchRecord();

  //endless scroll
  infinityScroll();

  //drag & drop

  $("#locationOps>li").draggable();
  $("#locationOps>li").css("display", "inline-block");
  $("input").droppable({
    drop: function (event, ui) {
      dropedVal.push(ui.draggable.text());
    },
  });
});

//display table view
//TODO: display num should only be # of records show each time, @param startIdx
function display(DisplayNum) {
  DisplayNum = DisplayNum === undefined ? 10 : DisplayNum;
  var arr = getStorageData();
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
        "' class = 'tbRow'><td class='firstname' id='firstname" +
        i +
        "'>" +
        val.firstname +
        "</td> <td class = 'lastname' id='lastname" +
        i +
        "'>" +
        val.lastname +
        "</td> <td class = 'email' id='email" +
        i +
        "'> " +
        val.email +
        "</td> <td class = 'location' id='location" +
        i +
        "'>" +
        val.location +
        "</td> <td class = 'phone' id='phone" +
        i +
        "'>" +
        val.phone +
        "</td><td class = 'address' id='addr" +
        i +
        "'>" +
        addressVal +
        "</td><td class = 'markOption' id='mark" +
        i +
        "'>" +
        markVal +
        "</td>" +
        "<td class = 'options'><button id ='showMore_btn" +
        i +
        "' onclick= 'showMore_row(" +
        i +
        ")'> More details </button> " +
        "<button class ='editBtn' id ='edit_btn" +
        i +
        "' onclick= 'edit_row(" +
        i +
        ")'> Edit </button> " +
        "<button class = 'saveBtn' id ='save_btn" +
        i +
        "' onclick= 'save_row(" +
        i +
        ")'> Save </button> " +
        " <button  class ='deleteBtn' onclick= 'delete_row(" +
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

// function constructTable(start_idx, numRow) {}

//field to add student record to the local storage: address ==> drag drop multiple input
//TODO: add locations & multiple records field
function addRecord() {
  let newRecord = {};
  newRecord.firstname = $("#firstname_add").val();
  newRecord.lastname = $("#lastname_add").val();
  newRecord.email = $("#email_add").val();
  newRecord.phone = $("#phone_add").val();
  newRecord.location = dropedVal;
  dropedVal = [];

  //addresses
  newRecord.address = {};
  newRecord.address.communication = $("#communication_add").val();
  newRecord.address.permanent = $("#permanent_add").val();
  //marks
  newRecord.marks = {};
  newRecord.marks.english = $("#english_add").val();
  newRecord.marks.science = $("#science_add").val();
  newRecord.marks.computers = $("#computers_add").val();
  newRecord.marks.hardware = $("#hardware_add").val();

  //clear input field
  $(".addNewRecord")
    .find("input")
    .each(function () {
      $(this).val("");
    });

  //FIXME: check if record has important fields filled or not
  const arr = getStorageData();
  // arr.push(newRecord);
  arr.unshift(newRecord); //TEST
  SetStorageData(arr);
  reloadTable();
}

//TODO: search only 4 fields instead of all
function searchRecord() {
  $("#searchBar").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTb>tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
}

function infinityScroll() {
  $(window).scroll(function () {
    //check if it's at the bottom of the page: this is the window
    if (
      $(document).height() - $(window).height() - 50 <
      $(window).scrollTop()
    ) {
    }
  });
}

//show more details of the record
function showMore_row(i) {
  $("#markField").show();
  $("#mark" + i).show();
  $("#showMore_btn" + i).hide();
}

//edit the table record for row i
// TODO & FIXME: add multiple fields of edit in addr & marks &Locations
function edit_row(i) {
  $("#save_btn" + i).show();
  $("#edit_btn" + i).hide();

  //select every table field at record (rowi) to get their input
  $("#row" + i)
    .children("td")
    .each(function () {
      var className = $(this).attr("class");
      // if the td is option, skip
      if (className === "options") {
        return true;
      }
      // if td is for location
      else if (className === "location") {
      } else if (className === "address") {
        //set current row's content ==> input
        let userInput = $(this).html();
      } else if (className === "markOption") {
      } else {
        //For firstname, lastname, email, phone
        let type = "text";
        if (className === "email") {
          type = "email";
        }
        if (className === "phone") {
          type = "tel";
        }
        //set current row's content ==> input
        let userInput = $(this).html();
        $(this).html(
          "<input type='" +
            type +
            "' id='" +
            className +
            "_text" +
            i +
            "' value = '" +
            userInput +
            "'> "
        );
      }
    });
}

//also save to the localStorage
//FIXME: so much repeated code - optimize it
function save_row(i) {
  $("#save_btn" + i).hide();
  $("#edit_btn" + i).show();
  var arr = getStorageData();

  //get data from user input(new table row) --> current display
  $("#row" + i)
    .children("td")
    .each(function () {
      var className = $(this).attr("class");
      if (className === "options") {
        return true;
      }
      // if td is for location
      else if (className === "location") {
      } else if (className === "address") {
      } else if (className === "markOption") {
      } else {
        //set current row's input => content
        let userInput = $(this).children("input").val();
        $(this).html(userInput);
      }
    });

  //save new record to local storage
  saveRow(i);
}

//remove record in local storage & tabele view
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

//get storage by returning an JSON object array
function getStorageData() {
  return JSON.parse(localStorage.getItem("studentData"));
}

//set local storage
function SetStorageData(arr) {
  localStorage.setItem("studentData", JSON.stringify(arr));
  return;
}

//OPTME: optimize in the future --  loop to save properties in an object
function saveRow(i) {
  var arr = getStorageData();
  arr[i].firstname = $("#firstname" + i).text();
  arr[i].lastname = $("#lastname" + i).text();
  arr[i].email = $("#email" + i).text();
  arr[i].phone = $("#phone" + i).text();
  // arr[i].location = $("#location" + i).text();
  // arr[i].address = $("#address" + i).text();
  // arr[i].marks = $('#markOption'+ i).text()
  SetStorageData(arr);
}
