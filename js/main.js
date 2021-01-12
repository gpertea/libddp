// place my custom js here
var dtaRegs=[ 'DLPFC','Hippocampus', 'Caudate', 'MPFC', 
  'sACC','Cerebellum', 'Entorhinal Cortex', 'Amygdala' ,
  'Median Amygdala','Basolaterlal Amygdala','Nucleus Accumbens',
  'Insular Cortex','Subiculum','Dentate Gyrus','Ventral Tegmental Area'
  ];

var dtaXTypes=[ 'RNA-seq', 'long read RNA-seq', 'scRNA-seq', 'micro RNA-seq',
  'WGS', 'WGBS', 'DNA methylation', 'ATAC-seq' ];

//-- JSON data from database 
var dtaRegion= [{"id":1,"name":"Amygdala","num":548}, 
  {"id":2,"name":"BasoAmyg","num":318}, 
  {"id":3,"name":"Caudate","num":464}, 
  {"id":4,"name":"dACC","num":322}, 
  {"id":5,"name":"DentateGyrus","num":263}, 
  {"id":6,"name":"DLPFC","num":1599}, 
  {"id":7,"name":"Habenula","num":69}, 
  {"id":8,"name":"HIPPO","num":539}, 
  {"id":9,"name":"MedialAmyg","num":322}, 
  {"id":10,"name":"mPFC","num":297}, 
  {"id":11,"name":"NAc","num":235}, 
  {"id":12,"name":"sACC","num":560}];

var dtaDataset=[{"id":1,"name":"Astellas_DG","num":263}, 
    {"id":2,"name":"BrainSeq_Phase1","num":727}, 
    {"id":3,"name":"BrainSeq_Phase2_DLPFC","num":453}, 
    {"id":4,"name":"BrainSeq_Phase2_HIPPO","num":447}, 
    {"id":5,"name":"BrainSeq_Phase3_Caudate","num":464}, 
    {"id":6,"name":"BrainSeq_Phase4and5","num":490}, 
    {"id":7,"name":"Habenula","num":69}, 
    {"id":8,"name":"Nicotine_NAc","num":235}, 
    {"id":9,"name":"psychENCODE_BP","num":17}, 
    {"id":10,"name":"psychENCODE_Mood","num":1091}, 
    {"id":11,"name":"VA_PTSD","num":1280}];

var dtaDx=[{"id":1,"name":"Control","num":2509}, 
{"id":2,"name":"Schizo","num":822}, 
{"id":3,"name":"Bipolar","num":649}, 
{"id":4,"name":"MDD","num":1248}, 
{"id":5,"name":"PTSD","num":306}, 
{"id":6,"name":"Other","num":2}];

var dtaSex=[{"id":1,"name":"M","num":3714}, 
 {"id":2,"name":"F","num":1822}];

var dtaRace=[{"id":1,"name":"AA","num":1599}, 
 {"id":2,"name":"AS","num":36}, 
 {"id":3,"name":"CAUC","num":3839}, 
 {"id":4,"name":"HISP","num":59}, 
 {"id":5,"name":"Other","num":3}];

var dtaProtocol= [{"id":1,"name":"PolyA","num":727}, 
 {"id":2,"name":"RiboZeroGold","num":1450}, 
 {"id":3,"name":"RiboZeroHMR","num":404}, 
 {"id":4,"name":"(unknown)","num":2955}];

var selcol=0;
var selregs=[]; 
for (var i=0;i<dtaRegs.length;i++) selregs.push(0);

var mxMaxVal = 146; //maximum value in the matrix (for shading)
var clShadeHover='#FFF4F4';
var clShadeHoverRGB='rgb(255,240,240)';
var clHdrSelFg='#A00';

$(document).ready(function() {
    fillXMatrix(); //get data and fill matrix
    populateFilter('fltDx', dtaDx); //populate Diagnosis filter
    populateFilter('fltRace', dtaRace); //populate Diagnosis filter
    populateFilter('fltDataset', dtaDataset); //populate Diagnosis filter
    populateFilter('fltSex', dtaSex); //populate Diagnosis filter
    populateFilter('fltProto', dtaProtocol); //populate Diagnosis filter
    //popGenderFilter();
    //showAgeFilter();
    //popRaceFilter();
    
    /* enable some controls:
    $(function() {
      $('.multiselect-ui').multiselect({
          includeSelectAllOption: true
      });
     });
     */

     $(document).on('click', '.lg-title', function(e){
      var t = $(this);
      var p = t.parents('.lg-panel').find('.lg-scroller');
    if(!t.hasClass('lg-collapsed')) {
      p.collapse('hide');
      t.addClass('lg-collapsed');
      t.find('.coll-glyph').html("&#x25BD;")
      //$this.find('b').removeClass('bi-chevron-up').addClass('bi-chevron-down');
    } else {
      p.collapse('show');
      t.removeClass('lg-collapsed');
      t.find('.coll-glyph').html("&#x25B3;")
      //$this.find('b').removeClass('bi-chevron-down').addClass('bi-chevron-up');
    }
  })
  
  $(document).on('click', '.lg-item', function(e){
      var t = $(this);
      glog("clicked item: "+t.html());
      if(!t.hasClass('lg-sel')) {
      //var p=$this.parents('.panel').find('.panel-body');
      t.addClass('lg-sel');
      //$this.find('b').removeClass('bi-chevron-up').addClass('bi-chevron-down');
    } else {
      t.removeClass('lg-sel');
      //$this.find('b').removeClass('bi-chevron-down').addClass('bi-chevron-up');
    }
  })
  
  
  $('.lg-scroller').on('scroll', function(e) {
      var t = $(this);
      var y = t.scrollTop();
      var p = t.parents('.lg-panel').find('.lg-title');
      var l = t.parents('.lg-panel').find('.lg-lst');
      glog("scrollTop value is:  "+ y + "; inner height: " + t.innerHeight()
         + ", list height: " + l.outerHeight() );
      if (y>0) {
         p.addClass('lg-b-shadow');
      }
      else {
         p.removeClass('lg-b-shadow');
      }
      if (y+t.innerHeight()>=l.outerHeight()) {
        t.removeClass('lg-in-shadow');
      } else {
        t.addClass('lg-in-shadow');
      }
  })


    //matrix hover behavior
    $("#rxMatrix td").hover(function()  {
        var t=$(this);
        /* $this.addClass('hover_hl hover_cell');
        $this.siblings().addClass('hover_hl'); */
        //$t.siblings('td').css('background-color', shadeCl);
        t.siblings('td').each(function() {
          var td=$(this);
          var coln = td.index(); // 1-based !
          var ridx =  td.parent().index();
           tdHighlight(td, ridx, coln);
        });
        var th=t.siblings('th');
        if (selregs[t.parent().index()]) {
          th.css('background-color', clShadeHover);
          th.css('color', clHdrSelFg);
        } else { //regular, not selected region
          th.css('background-color', clShadeHover);
          th.css('color', '#222');
        }

        var ind = t.index()+1;
        //$('#rxMatrix td:nth-child(' + ind + ')').css('background-color', shadeCl);
        $('#rxMatrix td:nth-child(' + ind + ')').each( function() {
          var td=$(this);
          tdHighlight(td, td.parent().index(), td.index());
        });
        //t.css('background-color','#FFFFEE');
        tdHighlight(t, t.parent().index(), ind-1);
        //find the span inside the div
        var ch=$('#rxMatrix th:nth-child(' + ind + ') > div > span');
        if (ind-1==selcol) {
          ch.css('color', clHdrSelFg);
          ch.css('font-weight', 'bold');
        } else {
          ch.css('color', '#222');
          ch.css('font-weight', '600');
        }
      }, function() {
        var t=$(this);
        //t.siblings('td').css('background-color', ''); 
        t.siblings('td').each( function() {
          var td=$(this);
          tdColRestore(td, td.parent().index(), td.index());
        });

        var th=t.siblings('th');
        if (selregs[t.parent().index()]) {
          th.css('color', clHdrSelFg); 
          th.css('background-color', ''); 
        } else {
           th.css('color', ''); 
           th.css('background-color', ''); 
        }
        var ind = t.index()+1;
        //$('#rxMatrix td:nth-child(' + ind + ')').css('background-color', ''); 
        $('#rxMatrix td:nth-child(' + ind + ')').each( function() {
          var td=$(this);
          tdColRestore(td, td.parent().index(), td.index());
        });
        var ch=$('#rxMatrix th:nth-child(' + ind + ') > div > span');
        if (ind-1==selcol) {
          ch.css('color', clHdrSelFg);
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
        //glog("Text for selected cell is: ["+t.text()+ "] with col num "+coln+ " and row index "+rowidx+" (selregs["+rowidx+"]="+selregs[rowidx]+")");
        //alert("Text: "+$t.text());
      });

});

function selectCell(t, cnum, ridx) {
  if (t.html().trim().length==0) return;
  t.css('font-weight','bold');
  t.css('color', '#fff');
  t.css('background-color', clHdrSelFg);
  var th=t.siblings('th')
  th.css('color', clHdrSelFg);
  th.css('font-weight', 'bold');
  selregs[ridx]=1;
  if (selcol==0) {
    var ind=cnum+1;
    var ch=$('#rxMatrix th:nth-child(' + ind + ') > div > span');
    ch.css('color', clHdrSelFg);
    ch.css('font-weight', 'bold');
    selcol=cnum;
  }
}

function deselectCell(t, ridx) {
  t.css('font-weight','normal');
  var obg=t.prop('obg');
  var ofg=t.prop('ofg');
  if (ofg) t.css('color', ofg);
  if (obg) t.css('background-color', obg);
  
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

function tdHighlight(t) {
  var obg=t.prop('obg');
  if (obg) {
    var nc=blendRGBColors(obg, clShadeHoverRGB, 0.1);
    t.css('background-color', nc );
  }
  else t.css('background-color', clShadeHover);
}

function tdColRestore(t) {
  var obg=t.prop('obg');
  if (obg) {
     t.css('background-color', obg);
  }
  else t.css('background-color', '');
}


function fillXMatrix() {
 //populate top header 
 $('#rxMatrix > thead > tr').append(
  $.map(dtaXTypes, function(xt) { 
     return '<th class="rt"><div><span>'+xt+'</span></div></th>';
  }).join());
  //populate rows:
  $('#rxMatrix > tbody').append(
    $.map(dtaRegion, function(r, i) { 
      return '<tr> <th>'+r.name+'</th>'+
         $.map(dtaXTypes, function(x,j) {
           var v=0;
           if (j>0) { //generate randomly
             v=Math.floor(Math.random() * mxMaxVal);
             if (v%3==0) v=Math.floor(Math.random() * mxMaxVal);
              else v=0;
           } else {
             v=r.num;
           }
           if (v==0) v='';
           return '<td>'+v+'</td>';
         }).join() + " </tr>\n";
   }).join());
   // now iterate through all cells to record their original color values
   $('#rxMatrix td').each(function() {
       var v=$(this).html();
       if (v>0) {
        var psh=v/(mxMaxVal*4.1); 
        var bc=shadeRGBColor('rgb(240,240,240)', -psh);
        var fg=(getRGBLuminance(bc)<120)? '#fff':'#000';
         $(this).prop('obg', bc);
         $(this).css('background-color', bc);
         $(this).prop('ofg',fg);
         $(this).css('color', fg);
       }
   });
}

function populateFilter(id, dta) {
  /* <li class="d-flex justify-content-between lg-item">
    First one <span class="badge-primary badge-pill lg-count">24</span>
    </li> */
  $('#'+id+' .lg-lst').append(
    $.map(dta, function(d,i) { 
       return '<li class="d-flex justify-content-between lg-item">'+d.name+
         ' <span class="badge-primary badge-pill lg-count">'+d.num+'</span>'+
         "</li>\n";
    }).join(''));
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