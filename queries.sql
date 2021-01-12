-- Get counts by Datasets:
SELECT d.id, d.name, count(*) as num
  from datasets d, exp_rnaseq x 
  WHERE d.id = x.dataset_id
  GROUP BY 1 ORDER BY 2
  
  
SELECT json_agg(t) from (
select d.id, d.name, count(*) as num
  from datasets d, exp_rnaseq x 
  where d.id = x.dataset_id
  GROUP BY 1 ORDER BY 2) t
  
-- slightly faster way to do joined aggregations like these

WITH x AS ( SELECT dataset_id, COUNT(*) as num
	FROM exp_rnaseq	GROUP BY 1 )
SELECT json_agg(t) from (SELECT d.id, d.name, num 
  FROM x, datasets d WHERE x.dataset_id=d.id) t

-- get counts per Brain Region:

SELECT json_agg(t) from (
 SELECT ROW_NUMBER() OVER (ORDER BY region) as id, 
  region, COUNT(*) as num 
	  FROM exp_rnaseq	x, samples s 
	   WHERE x.s_id = s.id
	    GROUP BY 2) t

-- get counts per Diagnosis

SELECT json_agg(t) FROM
(SELECT ROW_NUMBER() OVER (ORDER BY dx) as id, 
  dx as name, COUNT(*) as num 
	  FROM exp_rnaseq x, samples s, subjects p
	   WHERE x.s_id = s.id AND s.subj_id=p.id
	    GROUP BY 2) t
      

-- counts by race
SELECT json_agg(t) FROM
(SELECT ROW_NUMBER() OVER (ORDER BY race) as id, 
  race as name, COUNT(*) as num 
	  FROM exp_rnaseq x, samples s, subjects p
	   WHERE x.s_id = s.id AND s.subj_id=p.id
	    GROUP BY 2) t


-- counts by sex
SELECT json_agg(t) FROM
(SELECT ROW_NUMBER() OVER (ORDER BY sex) as id, 
  sex as name, COUNT(*) as num 
	  FROM exp_rnaseq x, samples s, subjects p
	   WHERE x.s_id = s.id AND s.subj_id=p.id
	    GROUP BY 2) t
