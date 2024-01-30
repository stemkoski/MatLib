/**
 * Library for exact calculuations with fractional/rational numbers.
 * @namespace
 */
var FRACLIB = {};

/**
 * A Fraction object represents a rational number. It has an integer numerator and (nonzero) integer denominator.
 * Supported operations: addition, subtraction, multiplication, division, negation, inversion.
 * Fractions are always reduced to lowest terms.
 * @class
 */
FRACLIB.Fraction = class
{
    /**
     * Create a Fraction object.
     * @constructor
     * @param {Integer} numerator 
     * @param {Integer} denominator 
     */
    constructor(numerator=0, denominator=1)
    {
        this.numerator = numerator;

        if (denominator == 0)
            throw new Error("Fraction denominator may not be 0.");
        else
            this.denominator = denominator;

        // always reduce fractions to lowest terms
        this.reduce();
    }

    toString()
    {
        if (this.denominator == 1)
            return this.numerator.toString();
        else
            return this.numerator + "/" + this.denominator;
    }

    copy( otherFraction )
    {
        this.numerator = otherFraction.numerator;
        this.denominator = otherFraction.denominator;
        return this;
    }

    clone()
    {
        return new FRACLIB.Fraction().copy( this );
    }

    equals(otherFraction)
    {
        return (this.numerator == otherFraction.numerator) && (this.denominator == otherFraction.denominator);
    }

    /**
     * Set the values of the numerator and denominator of this fraction.
     * @param {*} numerator the new numerator of this fraction
     * @param {*} denominator the new denominator of this fraction
     * @return {Fraction} Returns this object (to enable chained function calls)
     */
    setValues(numerator=0, denominator=1)
    {
        this.numerator = numerator;
        this.denominator = denominator;
        return this.reduce();
    }

    reduce()
    {
        let gcd = FRACLIB.gcd(this.numerator, this.denominator);
        this.numerator /= gcd;
        this.denominator /= gcd;

        // no negative numbers in denominator
        if (this.denominator < 0)
        {
            this.numerator *= -1;
            this.denominator *= -1;
        }

        return this;
    }

    /**
     * Add another fraction to this fraction.
     * @param  {Fraction} otherFraction fraction that will be added to this fraction
     * @return {Fraction} Returns this object (to enable chained function calls)
     */
    add( otherFraction )
    {
        let a = this.numerator;
        let b = this.denominator;
        let c = otherFraction.numerator;
        let d = otherFraction.denominator;
        this.numerator = a*d + b*c;
        this.denominator = b*d;
        return this.reduce();
    }

    sub( otherFraction )
    {
        let a = this.numerator;
        let b = this.denominator;
        let c = otherFraction.numerator;
        let d = otherFraction.denominator;
        this.numerator = a*d - b*c;
        this.denominator = b*d;
        return this.reduce();
    }

    negate()
    {
        this.numerator *= -1;
        return this.reduce();
    }

    mult( otherFraction )
    {
        this.numerator *= otherFraction.numerator;
        this.denominator *= otherFraction.denominator;
        return this.reduce();
    }

    div( otherFraction )
    {
        this.numerator *= otherFraction.denominator;
        this.denominator *= otherFraction.numerator;
        return this.reduce();
    }

    invert()
    {
        let n = this.numerator;
        let d = this.denominator;
        this.numerator = d;
        this.denominator = n;
        return this.reduce();
    }
}

// static functions

/**
 * Calculate the sum of two Fraction objects.
 * @example
 * let a = new FRACLIB.Fraction(1, 2);  // a equals 1/2
 * let b = new FRACLIB.Fraction(1, 3);  // b equals 1/3
 * let c = FRACLIB.addFractions(a, b);  // c equals 5/6
 * @static
 * @param  {Fraction} fractionA first fraction
 * @param  {Fraction} fractionB second fraction
 * @return {Fraction} the sum: fractionA + fractionB
 */
FRACLIB.addFractions = function(fractionA, fractionB)
{
    return fractionA.clone().add(fractionB);
}

/**
 * Calculate the difference of two Fraction objects.
 * @example
 * let a = new FRACLIB.Fraction(1, 2);  // a equals 1/2
 * let b = new FRACLIB.Fraction(1, 3);  // b equals 1/3
 * let c = FRACLIB.subFractions(a, b);  // c equals 1/6
 * @static
 * @param  {Fraction} fractionA first fraction
 * @param  {Fraction} fractionB second fraction
 * @return {Fraction} the difference: fractionA - fractionB
 */
FRACLIB.subFractions = function(fractionA, fractionB)
{
    return fractionA.clone().sub(fractionB);
}

/**
 * Calculate the product of two Fraction objects.
 * @example
 * let a = new FRACLIB.Fraction(1, 2);   // a equals 1/2
 * let b = new FRACLIB.Fraction(1, 3);   // b equals 1/3
 * let c = FRACLIB.multFractions(a, b);  // c equals 1/6
 * @static
 * @param  {Fraction} fractionA first fraction
 * @param  {Fraction} fractionB second fraction
 * @return {Fraction} the product: fractionA * fractionB
 */
FRACLIB.multFractions = function(fractionA, fractionB)
{
    return fractionA.clone().mult(fractionB);
}

/**
 * Calculate the quotient of two Fraction objects.
 * @example
 * let a = new FRACLIB.Fraction(1, 2);  // a equals 1/2
 * let b = new FRACLIB.Fraction(1, 3);  // b equals 1/3
 * let c = FRACLIB.divFractions(a, b);  // c equals 3/2
 * @static
 * @param  {Fraction} fractionA first fraction
 * @param  {Fraction} fractionB second fraction
 * @return {Fraction} the quotient: fractionA / fractionB
 */
FRACLIB.divFractions = function(fractionA, fractionB)
{
    return fractionA.clone().div(fractionB);
}

FRACLIB.gcd = function( a, b )
{
    if (a == 0)
        return b;

    if (b == 0)
        return a;

    return MATLIB.gcd( b, a % b );
}

FRACLIB.lcm = function( a, b )
{
    return (a * b) / MATLIB.gcd(a, b);
}

FRACLIB.parseFrac = function( fracString )
{
    if (fracString.includes("/"))
    {
        let array = fracString.split("/");
        return new FRACLIB.Fraction( parseInt(array[0]), parseInt(array[1]) );
    }
    else // fracString represents an integer
    {
        return new FRACLIB.Fraction( parseInt(fracString) );
    }
}

// new library to process rational matrices exactly

/**
 * Library for exact calculuations with matrices containing fractional/rational numbers.
 * @namespace
 */
var MATLIB = {};

// internally, array index starts at 0
// if this is set to true
//  function index inputs and outputs are adjusted 
//  (subtract 1 and add 1, respectively)
//  to align with mathematical conventions
MATLIB.indexStart1 = false;

/**
 * Create a new Matrix object.
 * @class
 */
MATLIB.Matrix = class
{
    // two ways to create a matrix object:

    // create a 2-by-3 zero matrix 
    // let M = new MATLIB.Matrix(2, 3); 

    // create a 2-by-3 matrix with given values (in row order)
    // let M = new MATLIB.Matrix( [ [3,1,4] , [2,5,6] ] );
    constructor(parameter1, parameter2)
    {
        if ((typeof parameter1) == "number" && (typeof parameter2) == "number")
        {
            this.numberRows    = parameter1;
            this.numberColumns = parameter2;
            this.setupValueArray();
            this.fill( new FRACLIB.Fraction(0) );
        }
        else if (parameter1 instanceof Array && parameter1[0] instanceof Array)
        {
            this.numberRows    = parameter1.length;
            this.numberColumns = parameter1[0].length;
            this.setupValueArray();
            this.setValues( parameter1 );
        }
        else
        {
            throw new Error("Invalid constructor parameters.");
        }
    }

    setupValueArray()
    {
        this.values = [];
        for (let i = 0; i < this.numberRows; i++)
        {
            let row = new Array(this.numberColumns);
            this.values.push( row );
        }
    }

    /**
     * Set every entry in this matrix to a constant value.
     * @param {Fraction} fractionValue the value to fill this matrix with
     * @returns {Matrix} Returns this object (to enable chained function calls)
     */
    fill( fractionValue )
    {
        for (let rowIndex = 0; rowIndex < this.numberRows; rowIndex++)
            for (let columnIndex = 0; columnIndex < this.numberColumns; columnIndex++)
                this.values[rowIndex][columnIndex] = fractionValue; 
                // use clone to avoid shared reference (logical error)

        return this;
    }

    // TODO: redo as valueString.   "setAllValues?"
    setValues( valueArray )
    {
        for (let rowIndex = 0; rowIndex < this.numberRows; rowIndex++)
            for (let columnIndex = 0; columnIndex < this.numberColumns; columnIndex++)
                this.values[rowIndex][columnIndex] = valueArray[rowIndex][columnIndex];

        return this;
    }

    // copy values from other matrix into this matrix
    // assumes this matrix and other matrix have same dimensions
    copy(other)
    {
        for (let rowIndex = 0; rowIndex < this.numberRows; rowIndex++)
            for (let columnIndex = 0; columnIndex < this.numberColumns; columnIndex++)
                this.values[rowIndex][columnIndex] = other.values[rowIndex][columnIndex].clone(); 
                // use clone to avoid shared reference (logical error)

        return this;
    }

    // return a new matrix with the same values as this matrix
    clone()
    {
        let M = new MATLIB.Matrix(this.numberRows, this.numberColumns);
        M.copy(this);
        return M;
    }

    // used to determine amount of padding to use in toString()
    getMaxStringLength() 
    {
        let max = 0;
        for (let rowIndex = 0; rowIndex < this.numberRows; rowIndex++)
            for (let columnIndex = 0; columnIndex < this.numberColumns; columnIndex++)
                if (this.values[rowIndex][columnIndex].toString().length > max)
                    max = this.values[rowIndex][columnIndex].toString().length;
        return max;
    }

    toString()
    {
        let string = "";
        let padAmount = this.getMaxStringLength();
        for (let rowIndex = 0; rowIndex < this.numberRows; rowIndex++)
        {
            let row = this.values[rowIndex];
            string += MATLIB.arrayToString( row, padAmount );
            string += "\n";
        }
        return string;
    }
  
    /**
     * Set every entry in this matrix to a random fractional value.
     * @param {Integer} minNumerator smallest possible value of numerator (inclusive)
     * @param {Integer} maxNumerator largest possible value of numerator (exclusive)
     * @param {Integer} minDenominator smallest possible value of denominator (inclusive)
     * @param {Integer} maxDenominator largest possible value of denominator (exclusive)
     * @returns {Matrix} Returns this object (to enable chained function calls)
     */
    setValuesRandomFrac(minNumerator = 0, maxNumerator = 10, minDenominator=1, maxDenominator=4)
    {
        for (let rowIndex = 0; rowIndex < this.numberRows; rowIndex++)
            for (let columnIndex = 0; columnIndex < this.numberColumns; columnIndex++)
            {
                let numerator = Math.floor( minNumerator + (maxNumerator - minNumerator) * Math.random() );
                let denominator = Math.floor( minDenominator + (maxDenominator - minDenominator) * Math.random() );
                this.values[rowIndex][columnIndex] = new FRACLIB.Fraction(numerator, denominator);
            }

        return this;
    }

    /**
     * Set every entry in this matrix to a random integer value (fractions with denominator equal to 1).
     * @param {Integer} minInteger smallest possible value (inclusive)
     * @param {Integer} maxInteger largest possible value (exclusive)
     * @returns {Matrix} Returns this object (to enable chained function calls)
     */
    setValuesRandomInt(minInteger = 0, maxInteger = 10)
    {
        return this.setValuesRandomFrac(minInteger, maxInteger, 1, 1);
    }

    getRowColumnValue(rowIndex, columnIndex)
    {
        if (MATLIB.indexStart1)
        {
            rowIndex--;
            columnIndex--;
        }

        return this.values[rowIndex][columnIndex];
    }

    setRowColumnValue(rowIndex, columnIndex, value)
    {
        if (MATLIB.indexStart1)
        {
            rowIndex--;
            columnIndex--;
        }

        this.values[rowIndex][columnIndex] = value;
        return this;
    }

    getRow( rowIndex )
    {
        let row = [];

        for (let columnIndex = 0; columnIndex < this.numberColumns; columnIndex++)
            row.push( this.getRowColumnValue(rowIndex, columnIndex) );

        return row;
    }

    setRow( rowIndex, valuesArray )
    {
        for (let columnIndex = 0; columnIndex < this.numberColumns; columnIndex++)
            this.setRowColumnValue( rowIndex, columnIndex, valuesArray[columnIndex] );

        return this;        
    }

    getColumn( columnIndex )
    {
        let column = [];

        for (let rowIndex = 0; rowIndex < this.numberRows; rowIndex++)
            column.push( this.getRowColumnValue(rowIndex, columnIndex) );

        return column;
    }

    setColumn( columnIndex, valuesArray )
    {
        for (let rowIndex = 0; rowIndex < this.numberRows; rowIndex++)
            this.setRowColumnValue( rowIndex, columnIndex, valuesArray[rowIndex] );

        return this;        
    }

    swapRows( rowIndexA, rowIndexB )
    {
        let rowA = this.getRow(rowIndexA);
        let rowB = this.getRow(rowIndexB);

        this.setRow(rowIndexA, rowB);
        this.setRow(rowIndexB, rowA);

        return this;
    }

    scaleRow( rowIndex, scalar )
    {
        let row = this.getRow(rowIndex);

        for (let i = 0; i < row.length; i++)
            row[i] *= scalar;

        this.setRow(rowIndex, row);

        return this;
    }

    // replaces shearedRow by shearedRow + scalar * shearingRow
    shearRow( shearedRowIndex, shearingRowIndex, scalar )
    {
        let shearedRow = this.getRow(shearedRowIndex);
        let shearingRow = this.getRow(shearingRowIndex);

        for (let i = 0; i < shearedRow.length; i++)
            shearedRow[i] += scalar * shearingRow[i];

        this.setRow(shearedRowIndex, shearedRow);

        return this;
    }

}


// auxillary functions

// paddedLength is the final total length you want the string to be;
//   adds leading spaces until this length is attained
MATLIB.padString = function(string, paddedLength=0)
{
    while (string.length < paddedLength)
        string = " " + string;

    return string;
}

// convert an array of values to a string with uniform space for each entry
MATLIB.arrayToString = function(array, paddedLength=3, separator=" ")
{
    let string = "[";
    for (let index = 0; index < array.length; index++)
    {
        string += MATLIB.padString(array[index].toString(), paddedLength);
        if (index < array.length - 1)
            string += separator;
    }
    string += "]";
    return string;
}

// convert an array of objects (matrix/string/etc objects) to a string; 
//   no commas, skip an extra line between each object
MATLIB.objectArrayToString = function(array)
{
    let string = "";
    for (let index = 0; index < array.length; index++)
    {
        string += array[index].toString();
        string += "\n";
    }
    return string;
}

// return -1 if all array values are zero (i.e. index does not exist; all values are zero)
MATLIB.firstNonzeroIndex = function( array )
{
    for (let index = 0; index < array.length; index++)
    {
        if (array[index] != 0)
        {
            if (MATLIB.indexStart1)
                index++;

            return index;
        }
    }

    // all values in array are zero; nonzero index does not exist
    return -1;
}

// get collection of nonzero values
MATLIB.nonzeroValues = function( array )
{
    let nonzeroArray = [];

    for (let index = 0; index < array.length; index++)
        if (array[index] != 0)
            nonzeroArray.push( array[index] );

    return nonzeroArray;
}

// take absolute values of all numbers in array
MATLIB.absoluteValues = function( array )
{
    let absoluteArray = [];

    for (let index = 0; index < array.length; index++)
        absoluteArray.push( Math.abs( array[index] ) );

    return absoluteArray;
}

// TODO: are these no longer used, with fractional values?
MATLIB.gcd = function( a, b )
{
    a = Math.abs(a);
    b = Math.abs(b);
    
    if (a == 0)
        return b;
    else if (b == 0)
        return a;
    else
        return MATLIB.gcd( b, a % b );
}

MATLIB.gcdArray = function( array )
{
    if ( array.length == 1 )
        return array[0];
    else
        return MATLIB.gcd( array[0], MATLIB.gcdArray(array.slice(1)) );
}

MATLIB.lcm = function( a, b )
{
    return (a * b) / MATLIB.gcd(a, b);
}

// reference: https://www.geeksforgeeks.org/lcm-of-given-array-elements/
MATLIB.lcmArray = function( array )
{
    if ( array.length == 1 )
        return array[0];
    else
    {
        let a = array[0];
        let b = MATLIB.lcmArray(array.slice(1));
        return ( a * b ) / MATLIB.gcd( a, b );
    }
}


// ******************
// under construction
// ******************

// rename to REF

// for testing, return a list of all the intermediate calculations 
MATLIB.rref = function( M )
{
    let resultsArray = [];

    resultsArray.push( "initial matrix:" );
    resultsArray.push( M.clone() );

    // let totalRows    = M.numberRows;
    // let totalColumns = M.numberColumns;

    /*

    MATLIB.rref( new MATLIB.Matrix([
        [-1,0,0,1,0,0,0,0],
        [1,20,5,0,1,0,0,85],
        [2,-15,10,0,0,1,0,5],
        [1,-2,-6,0,0,0,1,-14]
    ]))

    */

    let currentRowIndex = 0;
    let currentColumnIndex = 0;

    while (true)
    {
        if (currentRowIndex >= M.numberRows || currentColumnIndex >= M.numberColumns)
            break;

        let leadingCoeff = M.getRowColumnValue( currentRowIndex, currentColumnIndex );
        
        // TODO: FIX ME -- what if leadingCoeff is == 0?

        if (leadingCoeff < 0)
        {
            leadingCoeff *= -1;
            M.scaleRow( currentRowIndex, -1 );
        }
        
        if (leadingCoeff == 0)
        {
            let nonZeroRowIndex = -1;
            for (let i = currentRowIndex + 1; i < M.numberRows; i++)
            {
                leadingCoeff = M.getRowColumnValue( currentRowIndex, currentColumnIndex );
                if (leadingCoeff != 0)
                {
                    nonZeroRowIndex = i;
                    break;
                }
            }

            if (nonZeroRowIndex != -1)
            {
                M.swapRows(nonZeroRowIndex, currentRowIndex);
                // TODO: add "swapping rows" message
            }
            else
            {
                currentColumnIndex++;
                // TODO: add "no available rows to swap" message
                continue;
            }
        }

        for (let rowIndex = 0; rowIndex < M.numberRows; rowIndex++ )
        {
            console.log( "I'm working on scaling row " + rowIndex )
            if (rowIndex == currentRowIndex)
                continue;

            let otherCoeff = M.getRowColumnValue( rowIndex, currentColumnIndex );
            
            // if value above or below leadingCoeff is 0, that row does not need to be sheared
            //   (or scaled in preparation for integer-based shearing); skip it
            if (otherCoeff == 0)
                continue;

            console.log( "whats the lcm of " + leadingCoeff + " and " + otherCoeff);
            let lcm = MATLIB.lcm(leadingCoeff, otherCoeff);
            console.log( "it's " + lcm )
            M.scaleRow( rowIndex, lcm/otherCoeff );
            let row = M.getRow(rowIndex)
            console.log( " and the row is ")
            console.log(row)
        }

        console.log("done scaling rows.")
        resultsArray.push( "scaled rows:" );
        resultsArray.push( M.clone() );

        for (let rowIndex = 0; rowIndex < M.numberRows; rowIndex++ )
        {
            console.log("I'm shearing row " + rowIndex)
            if (rowIndex == currentRowIndex)
                continue;

            let row = M.getRow( rowIndex )
            console.log(" which is ")
            console.log( row )
            let otherCoeff = M.getRowColumnValue( rowIndex, currentColumnIndex );
            let factor = otherCoeff/leadingCoeff;
            console.log("by a factor of " + factor)
            M.shearRow( rowIndex, currentRowIndex, -factor );

        }

        console.log("done shearing rows.")
        resultsArray.push( "sheared rows:" );
        resultsArray.push( M.clone() );

        for (let rowIndex = 0; rowIndex < M.numberRows; rowIndex++ )
        {
            let row = M.getRow(rowIndex);
            console.log("I'm reducing row " + rowIndex)
            console.log(" which is: ")
            console.log(row)
            let gcd = MATLIB.gcdArray( row );

            console.log("debug data")
            console.log(row)
            console.log( gcd )
            console.log( 1/gcd )
            if ( gcd != 0 )
            {
                console.log( "its okay to divide by " + gcd)
                M.scaleRow( rowIndex, 1/gcd );
            }
            else
            {
                console.log("i don't want to divide by " + gcd)
            }
            console.log( M.getRow(rowIndex) )
        }

        resultsArray.push( "reduced rows:" );
        resultsArray.push( M.clone() );

        currentRowIndex++;
        currentColumnIndex++;
    }

    return MATLIB.objectArrayToString( resultsArray );
}


