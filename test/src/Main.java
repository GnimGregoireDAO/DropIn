import java.util.Scanner;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {

//        for(int i=1; i<101; i++){
//            System.out.println("Nous affichons actuellement le chiffre: "+i);
//
//            if((i%3==0)&&(i%5==0)){
//                System.out.println("FizzBuzz");
//            }
//            else if(i%5==0){
//                System.out.println("Buzz");
//            }
//
//            else if(i%3==0){
//                System.out.println("Fizz");
//            }
//
//        }
        Scanner scn = new Scanner(System.in);
        String text = scn.nextLine();
        System.out.println(text);
    }
}