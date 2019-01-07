$(document).ready(function() {
	//open database
	var request = indexedDB.open('kritikevents',1);

	request.onupgradeneeded = function(e) {
		var db = e.target.result;

		if (!db.objectStoreNames.contains('kritik')) {
			var os = db.createObjectStore('kritik',{keyPath: "id", autoIncrement:true});
			os.createIndex('nama','nama',{unique:false});
		}
	}

	//sucess
	request.onsuccess = function(e) {
		console.log('Sukses: opened database.....');
		db = e.target.result;
		//show kritik
		showKritik();
	}

	//error
	request.onerror = function(e) {
		console.log('Error: tidak bisa membuat database.....');
	}

});

function addKritik(){
	var nama = $('#nama').val();
	var email = $('#email').val();
	var kritik = $('#kritik').val();

	var transaction = db.transaction(["kritik"],"readwrite");

	//ask for onjectstore
	var store = transaction.objectStore("kritik");

	//define kritikadd
	var kritikadd = {
		nama: nama,
		email: email,
		kritik: kritik
	}

	//perform the add
	var request = store.add(kritikadd);

	//sucess
	request.onsuccess = function(e) {
		alert("Komentar berhasil ditambah");
	}

	//error
	request.onerror = function(e) {
		alert("Gagal menambah kritik");
		console.log('Error', e.target.error.nama);
	}

}

function showKritik(e){
	var transaction = db.transaction(["kritik"],"readonly");
	//ask for onjectstore
	var store = transaction.objectStore("kritik");
	var index = store.index('nama');

	var output = '';
	index.openCursor().onsuccess = function(e){
		var cursor = e.target.result;
		if (cursor) {
			output += "<tr>";
			output += "<td><span>"+cursor.value.nama+"</span></td>";
			output += "<td><span>"+cursor.value.email+"</span></td>";
			output += "<td><span>"+cursor.value.kritik+"</span></td>";
			output += "<tr>";
			cursor.continue();
		}
		$('#tampilkritik').html(output);
	}
}