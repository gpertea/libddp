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


$(document).ready(function() {
    fillXMatrix(); //get data and fill matrix

    $("#rxMatrix td").hover(function()  {
        var $t=$(this);
        /* $this.addClass('hover_hl hover_cell');
        $this.siblings().addClass('hover_hl'); */
        $t.siblings().css('background-color', '#FAF5A5');
        var ind = $t.index()+1;
        $('#rxMatrix td:nth-child(' + ind + ')').css('background-color', '#FAF5A5');
        //find the span inside the div
        $('#rxMatrix th:nth-child(' + ind + ') > div > span').css('background-color', '#FAF5A5');
      }, function()  {
        var $t=$(this);
        /*$this.removeClass('hover_hl hover_cell');
        $this.siblings().removeClass('hover_hl');  */
        $t.siblings().css('background-color', ''); 
        var ind = $t.index()+1;
        $('#rxMatrix td:nth-child(' + ind + ')').css('background-color', ''); /*removeClass('hover_hl'); */  
        $('#rxMatrix th:nth-child(' + ind + ') > div > span').css('background-color', '');
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
     return '<th class="xt"><div><span>'+xt+'</span></div></th>';
  }).join());
  //populate rows:
  $('#rxMatrix > tbody').append(
    $.map(dtaRegs, function(r, i) { 
      return '<tr> <th>'+r+'</th>'+
         $.map(dtaXTypes, function(x,j) {
           return '<td>'+Math.floor(Math.random() * 386)+'</td>';
         }).join() + " </tr>\n";
   }).join());
}