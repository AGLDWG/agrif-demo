var policy_data_dp = null;
var policy_data_goa = null;
var query_ancestors = 'PREFIX agrif: <http://reference.data.gov.au/def/ont/agrif#> \n' +
                      'SELECT DISTINCT ?r \n' +
                      'WHERE { \n' +
                      '    ?x agrif:relatedTo ?r . \n' +
                      '    ?r a agrif:Record . \n' +
                      '    FILTER (?r != <http://governance.data.gov.au/id/dataset/dp/Policy_and_Procedure_Policy_2017_Final> ) \n' +
                      '}';

var query_artefacts = 'PREFIX agrif: <http://reference.data.gov.au/def/ont/agrif#> \n' +
                      'SELECT ?dc ?a ?s\n' +
                      'WHERE { \n' +
                      '    <http://governance.data.gov.au/id/dataset/dp/Policy_and_Procedure_Policy_2017_Final> \n' +
                      '        agrif:recordOf ?a ; \n' +
                      '        agrif:hasDisposalClass ?dc . \n' +
                      '    ?a a agrif:DigitalArtefact . \n' +
                      '    ?a agrif:storedIn ?s . \n' +
                      '    FILTER(?dc = agrif:RetainAsNationalArchives && ?s !=  <http://governance.data.gov.au/id/system/naa/Vault>) \n' +
                      '}';

var query_archives = 'PREFIX agrif: <http://reference.data.gov.au/def/ont/agrif#> \n' +
                     'SELECT DISTINCT ?r \n' +
                     'WHERE { \n' +
                     '    ?r agrif:recordOf ?a . \n' +
                     '    ?a agrif:storedIn <http://governance.data.gov.au/id/system/naa/Vault> . \n' +
                     '}';

$(function() {
    $('#tick-dp').hide();
    $('#trips-dp').val('');
    $('#tick-goa').hide();
    $('#trips-goa').val('');

    $('#query-ancestors-tbox').val(query_ancestors);
    $('#query-artefacts-tbox').val(query_artefacts);
    $('#query-archives-tbox').val(query_archives);
});

$('#load-dp').click(function() {
    $.get("https://raw.githubusercontent.com/AGLDWG/agrif-ont/master/examples/policy-creation-2-dp.ttl", function (data) {
        policy_data_dp = data;
        $('#trips-dp').val(policy_data_dp).show();
        $('#tick-dp').show();
        $('#results-load-dp').show();
    });
});

$('#load-goa').click(function() {
    $.get("https://raw.githubusercontent.com/AGLDWG/agrif-ont/master/examples/policy-creation-2-goa.ttl", function (data) {
        policy_data_goa = data;
        $('#trips-goa').val(policy_data_goa).show();
        $('#tick-goa').show();
        $('#results-load-goa').show();
    });
});

rdfstore.create(function(err, store) {
    $('#combine').click(function () {
        store.load("text/turtle", policy_data_dp, function (err, results1) {
            if (err) {
                console.log('load error');
                console.log(err);
            }
            store.load("text/turtle", policy_data_goa, function (err, results2) {
                if (err) {
                    console.log('load error');
                    console.log(err);
                }
                store.execute('SELECT * WHERE { ?s ?p ?o }', function (err, results3) {
                    if (!err) {
                        $('#combine-result').html(results3.length);
                        $('#results-combine').show();
                    } else {
                        console.log(err);
                    }
                });
            });
        });
    });

    $('#query-ancestors').click(function () {
        store.execute(query_ancestors, function(err, results) {
            if (!err) {
                var a = '';
                $.each(results, function (index, value) {
                    a += '&lt;' + value.r.value + '&gt;<br />';
                });
                $('#ancestors').html(a);
                $('#results-ancestors').show();
            } else {
                console.log(err);
            }
        })
    });

    $('#query-artefacts').click(function () {
        store.execute(query_artefacts, function(err, results) {
            if (!err) {
                var a = '';
                $.each(results, function (index, value) {
                    a += '&lt;' + value.a.value + '&gt;<br />';
                });
                $('#artefacts').html(a);
                $('#results-artefacts').show();
            } else {
                console.log(err);
            }
        })
    });

    $('#query-archives').click(function () {
        store.execute(query_archives, function(err, results) {
            if (!err) {
                var a = '';
                $.each(results, function (index, value) {
                    a += '&lt;' + value.r.value + '&gt;<br />';
                });
                $('#archives').html(a);
                $('#results-archives').show();
            } else {
                console.log(err);
            }
        })
    });
});

