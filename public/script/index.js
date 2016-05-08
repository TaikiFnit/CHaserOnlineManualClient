var domain  = 'http://www7019ug.sakura.ne.jp/CHaserOnline003';
var user = 'hot';
var password = 'hot';

$(function() {

UserCheck();




});

function UserCheck() {


	$.ajax({
		url: domain + '/user/UserCheck?user=' + user + '&pass=' + password,
		type: 'GET',
		success: function(data, textStatus) {

		    console.log(data);
		},
		error: function(e) {
			console.log(e);
		}
	});	

}