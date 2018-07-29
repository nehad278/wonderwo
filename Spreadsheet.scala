package codePractice

object Spreadsheet {

  def main(args: Array[String]) = {
    val input = scala.io.StdIn.readLine().split(" ").map(_.toInt)
    val n = input(0)
    val m = input(1)

    val inputArray = Array.ofDim[(String, Boolean, Float)](m, n)

    for(i <- 0 until m; j <- 0 until n) {
      val a = scala.io.StdIn.readLine()
      inputArray(i)(j) = (a, false, 0.floatValue)
    }

    var resultString = ""

    resultString += "%s %s\n".format(n, m)

    for(i <- 0 until m; j <- 0 until n) {
      val visitedSet = scala.collection.mutable.Set[(Int, Int)]()
      try{
        val res = "%.5f".format(compute(i, j, inputArray, visitedSet))
        resultString += res + "\n"
      } catch {
        case e: CyclicDependencyException =>
          println("Error: Cyclic dependency detected in spreadsheet")
          System.exit(1)
      }

    }

    println(resultString)
  }

  private def compute(i: Int, j: Int, inputArray: Array[Array[(String, Boolean, Float)]], visitedSet: scala.collection.mutable.Set[(Int, Int)]): Float = {
    if(visitedSet.contains((i,j))){
      throw new CyclicDependencyException
    } else {
      visitedSet.add((i,j))
    }

    if (inputArray(i)(j)._2){
      return inputArray(i)(j)._3
    }
    val computeStack = scala.collection.mutable.Stack[Float]()
    val a = inputArray(i)(j)._1.split(" ")


    for(index <- a.indices){

      try{
        val b = a(index).toFloat
        inputArray(i)(j) = (a(index), true, b)
        computeStack.push(b)
      } catch {
        case e: Exception =>
          a(index) match {
            case "++" =>
              val n: Float = computeStack.pop
              computeStack.push(n + 1.0.toFloat)
            case "--" =>
              val n: Float = computeStack.pop
              computeStack.push(n - 1.0.toFloat)
            case "+" =>
              val n: Float = computeStack.pop
              val m = computeStack.pop
              computeStack.push(m + n)
            case "-" =>
              val n = computeStack.pop
              val m = computeStack.pop
              computeStack.push(m - n)
            case "/" =>
              val n = computeStack.pop
              val m = computeStack.pop
              computeStack.push(m / n)
            case "*" =>
              val n = computeStack.pop
              val m = computeStack.pop
              computeStack.push(m * n)
            case _ =>
              val x = getIndex(a(index))
              val m = compute(x._1, x._2, inputArray, visitedSet)
              computeStack.push(m)
          }
      }


    }
    val res = "%.5f".format(computeStack.pop()).toFloat
    inputArray(i)(j) = (inputArray(i)(j)._1, true, res)

    res
  }

  private def getIndex(str: String): (Int, Int) = {
    var col = 0
    var row = ""
    for (i <- str){
      if (i.isDigit){
        row += i
      }
      else {
        col = (col * 26) + (i.toInt - 64)
      }
    }
    (col-1, row.toInt - 1)
  }

}

class CyclicDependencyException extends Exception

3 2
A2		
4 5 *		
A1	
A1 B2 / 2 +
3
39 B1 B2 * /