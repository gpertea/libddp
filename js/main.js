// place my custom js here
var dtaRegs=[ 'DLPFC','Hippocampus', 'Caudate', 'MPFC', 
  'sACC','Cerebellum', 'Entorhinal Cortex', 'Amygdala' ,
  'Median Amygdala','Basolaterlal Amygdala','Nucleus Accumbens',
  'Insular Cortex','Subiculum','Dentate Gyrus','Ventral Tegmental Area'
  ];
var dtaXTypes=[ 'RNA-seq', 'long read RNA-seq', 'scRNA-seq', 'micro RNA-seq',
  'WGS', 'WGBS', 'DNA methylation', 'ATAC-seq' ];

var selcol=0;
var selregs=[]; 
for (var i=0;i<dtaRegs.length;i++) selregs.push(0);

var mxMaxVal = 146; //maximum value in the matrix (for shading)
var shadeCl='#FFF4F4';
var shadeClrgb='rgb(255,240,240)';

$(document).ready(function() {
    fillXMatrix(); //get data and fill matrix
    // fillFilters()
    
    // enable some controls:
    $(function() {
      $('.multiselect-ui').multiselect({
          includeSelectAllOption: true
      });
     });

    //matrix hover behavior
    $("#rxMatrix td").hover(function()  {
        var t=$(this);
        /* $this.addClass('hover_hl hover_cell');
        $this.siblings().addClass('hover_hl'); */
        //$t.siblings('td').css('background-color', shadeCl);
        t.siblings('td').each(function() {
           tdHighlight($(this));
        });
        var th=t.siblings('th');
        if (selregs[t.parent().index()]) {
          th.css('background-color', shadeCl);
          th.css('color', '#800');
        } else { //regular, not selected region
          th.css('background-color', shadeCl);
          th.css('color', '#222');
        }

        var ind = t.index()+1;
        //$('#rxMatrix td:nth-child(' + ind + ')').css('background-color', shadeCl);
        $('#rxMatrix td:nth-child(' + ind + ')').each( function() {
          tdHighlight($(this));
        });
        //t.css('background-color','#FFFFEE');
        tdHighlight(t);
        //find the span inside the div
        var ch=$('#rxMatrix th:nth-child(' + ind + ') > div > span');
        if (ind-1==selcol) {
          ch.css('color', '#800');
          ch.css('font-weight', 'bold');
        } else {
          ch.css('color', '#222');
          ch.css('font-weight', '600');
        }
      }, function() {
        var t=$(this);
        //t.siblings('td').css('background-color', ''); 
        t.siblings('td').each( function() {
          tdColRestore($(this));
        });

        var th=t.siblings('th');
        if (selregs[t.parent().index()]) {
          th.css('color', '#800'); 
          th.css('background-color', ''); 
        } else {
           th.css('color', ''); 
           th.css('background-color', ''); 
        }
        var ind = t.index()+1;
        //$('#rxMatrix td:nth-child(' + ind + ')').css('background-color', ''); 
        $('#rxMatrix td:nth-child(' + ind + ')').each( function() {
          tdColRestore($(this));
        });
        var ch=$('#rxMatrix th:nth-child(' + ind + ') > div > span');
        if (ind-1==selcol) {
          ch.css('color', '#800');
          ch.css('font-weight', 'bold');
        } else {
          ch.css('color', '');
        }
      });

      $("#rxMatrix td").click( function() {
        var t=$(this);
        var coln = t.index(); // 1-based !
        var rowidx =  t.parent().index();
        if (selcol>0 && selcol!=coln) return; //ignore click outside the allowed column
        if (selregs[rowidx]) deselectCell(t, rowidx);
                        else selectCell(t, coln, rowidx);
        
        //console.log("Text for selected cell is: "+$t.text()+ " with col index "+colidx+ " and row index "+rowidx);
        glog("Text for selected cell is: ["+t.text()+ "] with col num "+coln+ " and row index "+rowidx+" (selregs["+rowidx+"]="+selregs[rowidx]+")");
        //alert("Text: "+$t.text());
      });

});

function selectCell(t, cnum, ridx) {
  if (t.html().trim().length==0) return;
  t.css('font-weight','bold');
  var th=t.siblings('th')
  th.css('color', '#800');
  th.css('font-weight', 'bold');
  selregs[ridx]=1;
  if (selcol==0) {
    var ind=cnum+1;
    var ch=$('#rxMatrix th:nth-child(' + ind + ') > div > span');
    ch.css('color', '#800');
    ch.css('font-weight', 'bold');
    selcol=cnum;
  }
}

function deselectCell(t, ridx) {
  t.css('font-weight','normal');
  selregs[ridx]=0;
  var th=t.siblings('th')
  th.css('color', '#222');
  th.css('font-weight', '600');
  var sel=0;
  for (i=0;i<selregs.length;i++) {
    if (selregs[i]) { sel=1; break; }
  }
  if (sel==0) {
    //deselect column
    if (selcol) {
      var ind=selcol+1;
      var ch=$('#rxMatrix th:nth-child(' + ind + ') > div > span');
      ch.css('color', '#222');
      ch.css('font-weight', '600');
    }
    selcol=0;
  }
}


function fillXMatrix() {
 //populate top header 
 $('#rxMatrix > thead > tr').append(
  $.map(dtaXTypes, function(xt) { 
     return '<th class="rt"><div><span>'+xt+'</span></div></th>';
  }).join());
  //populate rows:
  $('#rxMatrix > tbody').append(
    $.map(dtaRegs, function(r, i) { 
      return '<tr> <th>'+r+'</th>'+
         $.map(dtaXTypes, function(x,j) {
           var v=Math.floor(Math.random() * mxMaxVal);
           if (v%3==0) v=Math.floor(Math.random() * mxMaxVal);
           else v=0;
          if (v==0) v='';
          return '<td>'+v+'</td>';
         }).join() + " </tr>\n";
   }).join());
   // now iterate through all cells to record their original color values
   $('#rxMatrix td').each(function() {
       var v=$(this).html();
       if (v>0) {
        var psh=v/(mxMaxVal*1.5); 
        var bc=shadeRGBColor('rgb(240,240,240)', -psh);
        var fg=(getRGBLuminance(bc)<120)? '#fff':'#000';
         $(this).prop('obg', bc);
         $(this).css('background-color', bc);
         $(this).prop('ofg',fg);
         $(this).css('color', fg);
       }
   });
}

function tdHighlight(t) {
  var obg=t.prop('obg');
  if (obg) {
    var nc=blendRGBColors(obg, shadeClrgb, 0.1);
    t.css('background-color', nc );
  }
  else t.css('background-color', shadeCl);
}

function tdColRestore(t) {
  var obg=t.prop('obg');
  if (obg) {
     t.css('background-color', obg);
  }
  else t.css('background-color', '');
}

function getRGBLuminance(color) {
  var f=color.split(","),R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
  return Math.floor((2.99 * R + 5.87 * G + 1.14 * B)/10);
}

function shadeRGBColor(color, percent) {
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}

function blendRGBColors(c0, c1, p) {
  var f=c0.split(","),t=c1.split(","),R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
  return "rgb("+(Math.round((parseInt(t[0].slice(4))-R)*p)+R)+","+(Math.round((parseInt(t[1])-G)*p)+G)+","+(Math.round((parseInt(t[2])-B)*p)+B)+")";
}

function glog(a) {
  $( "#glog" ).html(a);
}