// place my custom js here
var selcol;
var selregs=[];
var dtaRegs=[ 'DLPFC','Hippocampus', 'Caudate', 'MPFC', 
  'sACC','Cerebellum', 'Entorhinal Cortex', 'Amygdala' ,
  'Median Amygdala','Basolaterlal Amygdala','Nucleus Accumbens',
  'Insular Cortex','Subiculum','Dentate Gyrus','Ventral Tegmental Area'
  ];
var dtaXTypes=[ 'RNA-seq', 'long read RNA-seq', 'scRNA-seq', 'micro RNA-seq',
  'WGS', 'WGBS', 'DNA methylation', 'ATAC-seq' ];

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
        t.siblings('th').css('background-color', shadeCl);
        t.siblings('th').css('color', '#222');
        var ind = t.index()+1;
        //$('#rxMatrix td:nth-child(' + ind + ')').css('background-color', shadeCl);
        $('#rxMatrix td:nth-child(' + ind + ')').each( function() {
          tdHighlight($(this));
        });
        //t.css('background-color','#FFFFEE');
        tdHighlight(t);
        //find the span inside the div
        $('#rxMatrix th:nth-child(' + ind + ') > div > span').css('color', '#222');
      }, function() {
        var t=$(this);
        //t.siblings('td').css('background-color', ''); 
        t.siblings('td').each( function() {
          tdColRestore($(this));
        });

        t.siblings('th').css('color', ''); 
        t.siblings('th').css('background-color', ''); 
        var ind = t.index()+1;
        //$('#rxMatrix td:nth-child(' + ind + ')').css('background-color', ''); 
        $('#rxMatrix td:nth-child(' + ind + ')').each( function() {
          tdColRestore($(this));
        });
        $('#rxMatrix th:nth-child(' + ind + ') > div > span').css('color', '');
      });

      $("#rxMatrix td").click( function() {
        var $t=$(this);
        var colidx = $t.index()-1;
        var rowidx =  $t.parent().index();
        $t.css('font-weight','bold');
        console.log("Text for selected cell is: "+$t.text()+ " with col index "+colidx+ " and row index "+rowidx);
        //alert("Text: "+$t.text());
      });

});

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
