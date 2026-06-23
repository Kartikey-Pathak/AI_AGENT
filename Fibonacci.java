import java.io.PrintStream;
public class Fibonacci {
    public static void main(String[] args) {
        PrintStream outputStream = System.out;
        int a = 0, b = 1;
        while (a < 9) {
            outputStream.println(a);
            int c = a + b;
            a = b;
            b = c;
        }
    }
}