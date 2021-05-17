

<div class="container-lg" style="max-width: 1450px;">
    <div class="text-body-box">
        <div class="row">
            <div class="col-12 col-md-12">
                <div class="earn_header">
                    <h3><b>Complete Offers and Earn!</b></h3>
                    <p>Complete any of the below offers and get credited Ethereum to your LunaBet.io account.</p>

                </div>
            </div>
        </div>
    

                    <div class="earn_container">
@if(!auth()->guest())
<iframe src="https://wall.adgaterewards.com/n6yaqA/{{ auth()->user()->_id }}" style="position:inherit; top:0px; left:0px; bottom:0px; right:0px; width:100%; overflow:hidden;
 height:100%; min-height: 650px; border:none; margin:0; padding:0;  z-index:999999;">Your browser doesn't support iframes</iframe>

@else
                    <div class="container">
                    <div class="alert alert-danger mb-4 p-2 text-center" role="alert">You need to be logged in to see survey offers. <br>

                    <button class="btn btn-reverse p-1 m-1" onclick="$.auth()">Login</button>
</div>
                    </div>

@endif
                    </div>
                </div>
            </div>
