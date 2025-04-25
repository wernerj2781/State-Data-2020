import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { stateList } from '../../objects/states'
import { Chart } from 'chart.js';
import { StateService } from '../state.service';
import { voteData } from './../../objects/voteData';

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.css']
})
export class GraphPageComponent implements OnInit {

  constructor(private stateService: StateService) { }

  chooseState: any = { id: 1, name: "Alabama" };
  states = stateList;
  private chartObj: any;
  private ctx: any;
  private datasets: any;
  private labels: Array<string> = [];
  private repVotes: Array<voteData> = [];
  private demVotes: Array<voteData> = [];
  private presStats: Array<object> = [];
  private ds: object;

  ngOnInit(): void {
    this.chartObj = null;
    this.chooseState = { id: 1, name: "Alabama" };
    this.ctx = document.getElementById('stateChart');
    this.compileChartData();
  }

  createOrUpdateChart() {

    if (!this.chartObj) {
      let config = {
        type: 'line',
        data: {
          lineTension: 0.5,
          datasets: this.presStats,
          labels: this.labels

        },
        options: {
          tooltips: {
            titleFontSize: 14,
            //callbacks: {
            //  title: ((tti, data) => {
            //    return data.datasets[tti[0].datasetIndex].label;
            //  }),
            //afterTitle: ((tti, data) => {
            //let m = moment.utc(data.labels[tti[0].index]);
            //m.local();
            //return 'Date: ' + m.format('h:mm:ss A') + ' (' + m.fromNow() + ')';
            //}),
            //label: ((tti, data) => {
            //  let dataValue = data.datasets[tti.datasetIndex].data[tti.index];
            //  return 'Count: ' + dataValue.toString();
            //}),
            // }
          },
        }
      }
      this.chartObj = new Chart(this.ctx, config);
    }

  }

  compileChartData() {
    this.stateService.getStateData(this.chooseState).subscribe(data => {
      let test = data as any;

      test.data.races[0].timeseries.forEach((element) => {
        let bidenj = element.vote_shares.bidenj;
        let trumpd = element.vote_shares.trumpd;
        bidenj = bidenj * element.votes;
        trumpd = trumpd * element.votes;
        this.repVotes.push(trumpd);
        this.demVotes.push(bidenj);
        this.labels.push(element.timestamp);
      });

      let trumpVotes = {
        label: 'Trump Votes',
        data: this.repVotes,
        borderColor: 'red',
        lineTension: 0,
      }

      let bidenVotes = {
        label: 'Biden Votes',
        data: this.demVotes,
        borderColor: 'blue',
        lineTension: 0,
      }

      this.presStats.push(trumpVotes);
      this.presStats.push(bidenVotes);
      
      this.createOrUpdateChart();
    });
  }

  changeState(state) {
    this.resetData();
    this.compileChartData();
  }

  resetData(){
    this.ctx = null;
    this.chartObj.destroy();
    this.chartObj = null;
    this.presStats = [];
    this.repVotes = [];
    this.demVotes = [];
    this.labels = [];
    this.ctx = document.getElementById('stateChart');
  }

}