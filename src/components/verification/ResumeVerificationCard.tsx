type Props = {

  decisionValue?: string;

  onViewResume: () => void;

  onDecisionChange: (
    value:string
  )=>void;

};


function ResumeVerificationCard({

decisionValue,

onViewResume,

onDecisionChange

}:Props){


return(

<div className="flex items-center gap-2">


<button

onClick={onViewResume}

className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"

>

View Resume

</button>



<select

value={decisionValue||""}

onChange={(e)=>onDecisionChange(e.target.value)}

className="border rounded-xl px-3 py-2 text-xs"

>

{/* <option value="" disabled hidden>
   Decision
</option> */}

<option value="Verified">

Verified

</option>

<option value="Not Verified">

Not Verified

</option>

<option value="Fraud">

Fraud

</option>

<option value="Rejected">

Rejected

</option>


</select>


</div>

);


}


export default ResumeVerificationCard;