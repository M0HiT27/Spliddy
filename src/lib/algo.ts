


class Pair {
    first: string = "";
    second: number = 0;
    constructor(a: string, b: number) {
        this.first = a;
        this.second = b;
    }
}




export function roundToDecimal(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}

export default function minimisePayments(arr: Pair[]) {
    arr.sort((a, b) => a.second - b.second);
    let maxTxn = Infinity;
    let ans: string[] = [];
    const curr_ans: string[] = [];
    function helper(index: number, curr_txn: number) {

        if (index >= arr.length) {
            if (curr_txn < maxTxn) {
                ans = [...curr_ans];
                maxTxn = curr_txn;

            }
            return;
        }
        if (arr[index].second >= 0) {
            helper(index + 1, curr_txn);
            return;
        }

        for (let j = index + 1; j < arr.length; j++) {
            if (arr[j].second <= 0) continue;

            const copyi = arr[index].second;
            const copyj = arr[j].second;

            let txnStatment: string = "";
            if (Math.abs(arr[index].second) >= arr[j].second) { // if the amount to be given is larger than the amount to be received
                arr[j].second = 0;
                arr[index].second += copyj;

                txnStatment = arr[index].first + " owes " + arr[j].first + " " + Math.abs(copyj);
            }
            else {
                arr[j].second += arr[index].second;
                arr[index].second = 0;
                txnStatment = arr[index].first + " owes " + arr[j].first + " " + Math.abs(copyi);

            }

            curr_ans.push(txnStatment);
            helper(index, curr_txn + 1);


            arr[index].second = copyi;
            arr[j].second = copyj;
            curr_ans.pop();
        }

    }
    helper(0, 0);

    return ans;
}