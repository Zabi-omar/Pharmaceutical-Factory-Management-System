
package com.pharmacy;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DatabaseConnection {

    public static void main(String[] args) {

        // Oracle database connection details
        String url = "jdbc:oracle:thin:@//localhost:1521/orclpdb";
        String username = "zabi";
        String password = "zabi78";

        try (
            Connection connection =
                DriverManager.getConnection(url, username, password)
        ) {

            System.out.println("================================");
            System.out.println("ORACLE DATABASE CONNECTION SUCCESSFUL");
            System.out.println("================================");

            // Verify the connected database user
            try (Statement statement = connection.createStatement();
                 ResultSet result = statement.executeQuery(
                     "SELECT USER, SYS_CONTEXT('USERENV', 'DB_NAME') AS DB_NAME, " +
                     "SYS_CONTEXT('USERENV', 'SERVICE_NAME') AS SERVICE_NAME " +
                     "FROM DUAL")) {

                if (result.next()) {
                    System.out.println("Connected User: " +
                        result.getString("USER"));

                    System.out.println("Database Name: " +
                        result.getString("DB_NAME"));

                    System.out.println("Service Name: " +
                        result.getString("SERVICE_NAME"));
                }
            }

            // Retrieve tables owned by the connected user
            String sql =
                "SELECT TABLE_NAME FROM USER_TABLES ORDER BY TABLE_NAME";

            try (Statement statement = connection.createStatement();
                 ResultSet result = statement.executeQuery(sql)) {

                System.out.println("\nTables owned by " + username + ":");

                while (result.next()) {
                    System.out.println(result.getString("TABLE_NAME"));
                }
            }

            System.out.println("\nDatabase verification completed!");

        } catch (Exception e) {

            System.out.println("DATABASE CONNECTION FAILED!");
            e.printStackTrace();
        }
    }
}
