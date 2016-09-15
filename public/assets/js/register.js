//function sendFormData(){
//    var formData = JSON.stringify($("#register_form").serializeArray());
//
//    $.ajax({
//        type: "POST",
//        url:"http://localhost:3000/register",
//        data: formData,
//        sucess: function(){
//            alert("something!");
//        },
//        error: function(textstatus, errorThrown) {
//            alert('text status ' + textstatus + ', err ' + errorThrown);
//        }
//    });
//}



//$http.post('register').success(function( data ) {
//    $scope.message= data; //from your sample;
//    alert( "Load was performed. " + data );
//});

//$(document).ready(function(){
//    var base_url = 'http://localhost:3000';
//    var index = 'index.php';
//    $('#register_form').submit(function(e){
//        e.preventDefault();
//    var url = base_url+'/register';
//        $.ajax({
//
//            url: url,
//            data: $(this).serialize(),
//            method: 'post',
//            dataType:'json',
//            success: function(data){
//                console.log(data);
//                var email = data.email;
//                var username = data.username;
//                var success = data.success;
//                var name = data.name;
//                var url = data.url;
//                var pass = data.password;
//                var conf_pass = data.password_confirm;
//                if (email != "") {
//                    $('#valid_error_email').html(email);
//                }
//                if (name != "") {
//                    $('#valid_error_name').html(name);
//                }
//                if (username != "") {
//                    $('#valid_error_uname').html(username);
//                }
//                if (pass != "") {
//                    $('#valid_error_pass').html(pass);
//                }
//                if (conf_pass != "") {
//                    $('#valid_error_pass_conf').html(conf_pass);
//                }
//                if(success != ""){
//                    window.location.href = url;
//                }
//
//            },
//            error:function(){
//                alert('error');
//            }
//        });
//
//    });
//
//});