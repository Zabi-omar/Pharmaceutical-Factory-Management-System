SELECT
    USER,
    SYS_CONTEXT('USERENV', 'CON_NAME') AS PDB_NAME
FROM DUAL;

CREATE TABLE TEST_TABLE (
    ID NUMBER PRIMARY KEY,
    NAME VARCHAR2(50)
);

drop table TEST_TABLE;

select * from user_tables;

select name from v$datafile;