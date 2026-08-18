function PANResultView({

data

}:any)
{
console.log("PAN RESULT");

console.log(data);

console.log(JSON.stringify(data,null,2));
const ocr =

data?.data?.ocr_result || {};


const verification =

data?.data?.verification_result || {};



const isMatched =

verification?.pan_match_status==="MATCH"

&&

verification?.name_match_status==="MATCH"

&&

verification?.dob_match_status==="MATCH";


return(

<div className="grid grid-cols-2 gap-6">


<div>

<p className="text-gray-500">

PAN Number

</p>

<p className="font-bold">

{ocr.pan_number || "-"}

</p>

</div>



<div>

<p className="text-gray-500">

Name

</p>

<p className="font-bold">

{ocr.full_name || "-"}

</p>

</div>



<div>

<p className="text-gray-500">

DOB

</p>

<p className="font-bold">

{ocr.date_of_birth || "-"}

</p>

</div>



<div>

<p className="text-gray-500">

PAN Match

</p>

<p

className={

verification.pan_match_status==="MATCH"

?

"font-bold text-green-600"

:

"font-bold text-red-600"

}

>

{verification.pan_match_status || "-"}

</p>

</div>



<div>

<p className="text-gray-500">

Name Match

</p>

<p

className={

verification.name_match_status==="MATCH"

?

"font-bold text-green-600"

:

"font-bold text-red-600"

}

>

{verification.name_match_status || "-"}

</p>

</div>



<div>

<p className="text-gray-500">

DOB Match

</p>

<p

className={

verification.dob_match_status==="MATCH"

?

"font-bold text-green-600"

:

"font-bold text-red-600"

}

>

{verification.dob_match_status || "-"}

</p>
</div>



<div>

<p className="text-gray-500">

Verification Status

</p>

<p

className={

isMatched

?

"font-bold text-green-600"

:

"font-bold text-red-600"

}

>

{

isMatched

?

"VERIFIED"

:

"MISMATCH"

}

</p>

</div>


</div>

)

}

export default PANResultView;