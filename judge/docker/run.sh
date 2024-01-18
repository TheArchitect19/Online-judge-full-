#!/bin/bash

lang=$1
RTE=0
CE=0

memArr=(3500 7500 95000 19000)
initMem=0



if [ "$lang" = "c" ]; then
    initMem=${memArr[0]}
    if gcc -o solution solution.c &> "$2"; then
        if { cat testcase.txt | /usr/bin/time -f "%e %M" -o "$3" timeout "$4"s ./solution &> "$2"; } || { RTE=1; }; then
            :
        fi
    else
        CE=1
    fi
elif [ "$lang" = "cpp" ]; then
    initMem=${memArr[1]}
    echo "Content of solution.cpp:"
    cat /code/solution.cpp
    echo "Contents of testcase.txt:"
    cat /code/testcase.txt
    if g++ -o /code/solution /code/solution.cpp 2> "$2_compile_errors"; then
        echo "Compilation successful."
        if { cat /code/testcase.txt | /usr/bin/time -f "%e %M" -o "$3" timeout "$4"s /code/solution | grep -v "result" > /code/output.txt 2>&1; } || { RTE=1; }; then
            echo "Execution successful."
        else
            echo "Execution failed."
        fi
    else
        echo "Compilation failed."
        CE=1
        cat "$2_compile_errors"
    fi
    cat /code/output.txt

elif [ "$lang" = "java" ]; then
    initMem=${memArr[2]}
    echo "Content of solution.java:"
    cat /code/solution.java
    echo "Contents of testcase.txt:"
    cat /code/testcase.txt
    if javac /code/solution.java 2> "$2_compile_errors"; then
        echo "Compilation successful."
        if { /usr/bin/time -f "%e %M" -o "$3" timeout "$4"s java -cp /code solution < /code/testcase.txt &> /code/output.txt; } || { RTE=1; }; then
            echo "Execution successful."
        else
            echo "Execution failed."
        fi
    else
        echo "Compilation failed."
        CE=1
        cat "$2_compile_errors"
    fi
    cat /code/output.txt
fi

elif [ "$lang" = "py" ]; then
    initMem=${memArr[3]}
    echo "Content of solution.py:"
    cat /code/solution.py
    echo "Contents of testcase.txt:"
    cat /code/testcase.txt
    if { cat /code/testcase.txt | /usr/bin/time -f "%e %M" -o "$3" timeout "$4"s python3 -u /code/solution.py | grep -v "result" > /code/output.txt 2>&1; } || { RTE=1; }; then
        echo "Execution successful."
    else
        echo "Execution failed."
    fi
    cat /code/output.txt
fi


if [ "$CE" -ne 0 ]; then
    echo "COMPILATION ERROR" >> "$2"
fi

if [ "$RTE" -ne 0 ]; then
    echo "RUNTIME ERROR" >> "$2"
fi

if [ "$CE" -eq 0 ] && [ "$RTE" -eq 0 ]; then
    echo "Debug: First argument is $1"
    echo "Debug: Second argument is $2"
    echo "Debug: Third argument is $3"

    arr=($(<"$3"))
    echo "${arr[@]}"
    
    if [ "${arr[0]}" = "Command" ]; then
        arr=("${arr[2]}" "${arr[3]}")
    fi

    time=$(echo "${arr[0]} * 1000" | bc)
    memory=$((arr[1] - initMem))

    timeDiff=$(echo "4 * 1000 - $time" | bc)
    if [ "$timeDiff" -le 0 ]; then
        echo "TLE" >> "$2"
    fi

    memDiff=$(echo "5 * 1000 - $memory" | bc)
    if [ "$memDiff" -le 0 ]; then
        echo "MLE" >> "$2"
    fi
fi

echo -e "\n$time" >> "$3"
echo "$memory" >> "$3"
