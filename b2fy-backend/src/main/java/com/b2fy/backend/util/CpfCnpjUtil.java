package com.b2fy.backend.util;

public final class CpfCnpjUtil {

    private CpfCnpjUtil() {}

    public static String apenasDigitos(String cpfOuCnpj) {
        if (cpfOuCnpj == null) return null;
        return cpfOuCnpj.replaceAll("\\D", "");
    }

    public static boolean isCpf(String cpfOuCnpj) {
        String digits = apenasDigitos(cpfOuCnpj);
        return digits != null && digits.length() == 11;
    }

    public static boolean isCnpj(String cpfOuCnpj) {
        String digits = apenasDigitos(cpfOuCnpj);
        return digits != null && digits.length() == 14;
    }

    public static boolean isValido(String cpfOuCnpj) {
        String digits = apenasDigitos(cpfOuCnpj);
        if (digits == null) return false;
        if (digits.length() == 11) return validarCpf(digits);
        if (digits.length() == 14) return validarCnpj(digits);
        return false;
    }

    private static boolean validarCpf(String cpf) {
        if (cpf.matches("(\\d)\\1{10}")) return false;
        int[] peso1 = {10, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] peso2 = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
        int d1 = calcularDigito(cpf.substring(0, 9), peso1);
        int d2 = calcularDigito(cpf.substring(0, 10), peso2);
        return d1 == Character.getNumericValue(cpf.charAt(9)) && d2 == Character.getNumericValue(cpf.charAt(10));
    }

    private static boolean validarCnpj(String cnpj) {
        if (cnpj.matches("(\\d)\\1{13}")) return false;
        int[] peso1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] peso2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int d1 = calcularDigito(cnpj.substring(0, 12), peso1);
        int d2 = calcularDigito(cnpj.substring(0, 13), peso2);
        return d1 == Character.getNumericValue(cnpj.charAt(12)) && d2 == Character.getNumericValue(cnpj.charAt(13));
    }

    private static int calcularDigito(String base, int[] peso) {
        int sum = 0;
        for (int i = 0; i < base.length(); i++) {
            sum += Character.getNumericValue(base.charAt(i)) * peso[i];
        }
        int rest = sum % 11;
        return rest < 2 ? 0 : 11 - rest;
    }
}
