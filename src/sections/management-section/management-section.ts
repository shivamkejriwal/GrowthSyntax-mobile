import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import Chart from 'chart.js';
import { Utils } from '../utils';



const getAllocationData = (data) =>{
  
    const NetCashFlowFromInvesting = Math.abs(data.NCFI) || 0;
    const capex = Math.abs(data.CAPEX) || 0;
    const rnd = Math.abs(data.RND) || 0;
    const acquisitions = Math.abs(capex - NetCashFlowFromInvesting);
    const totalAllocation = capex + rnd + acquisitions;

    const fix = (value) => (value < 0) ? 0 :
                    (value < 1) ? (value * 100).toFixed(2) : 100; // TO DO: remove after cleaner data
    const capexPercentage = fix(Utils.divide(capex, totalAllocation));
    const rndPercentage = fix(Utils.divide(rnd, totalAllocation));
    const acquisitionsPercentage = fix(Utils.divide(acquisitions, totalAllocation));
    return {
        capex: capexPercentage,
        rnd: rndPercentage,
        acquisitions: acquisitionsPercentage
    }
}

@Component({
  selector: 'management-section',
  templateUrl: 'management-section.html'
})
export class ManagementSection {
  company:any;
  currentData: any = {};
  charts: Array<any> = [];
  ticker: string = '';
  
  constructor(public events: Events) {
    this.events.subscribe('company', data => this.loadData(data));
    this.events.subscribe('company:reset', this.reset);
    this.reset();
  }

  private loadData = (data) => {
    console.log('ManagementSection-loadData');
    this.company = data;
    const dataComplete = Boolean(data.profile.ticker
                          && data.prices.ticker
                          && data.fundamentals.length > 0);
    const tickerMismatch = Boolean(this.ticker !== data.profile.ticker);
    if(dataComplete && tickerMismatch) {
        this.ticker = this.company.profile.ticker;
        console.log('ManagementSection-dataComplete', data);
        const list = this.company.fundamentals || [];
        this.currentData = Utils.getLastObject(list);
        this.buildGrowthAllocationChart();
    }
  }

  buildGrowthAllocationChart() {
      var ctx = document.getElementById("growthAllocationTimeline");
      const list = this.company.fundamentals;
      let allocationOverTime = [];
      list.forEach((ele) => {
          const allocation = getAllocationData(ele);
          allocationOverTime.push(allocation);
      });
      const years = Utils.reduce(list, 'date', (val) => val.split('-')[0]);
      const capex = Utils.reduce(allocationOverTime, 'capex', (val) => val);
      const rnd = Utils.reduce(allocationOverTime, 'rnd',(val) => val);
      const acquisitions = Utils.reduce(allocationOverTime, 'acquisitions', (val) => val);
      console.log('growthAllocationTimeline',{
          years,
          capex,
          rnd,
          acquisitions
      });
      var data = {
          labels: years,
          datasets: [
              {
                  label: 'Research',
                  data: rnd,
                  backgroundColor: 'rgba(249, 201, 117, 1)'
              },
              {
                  label: 'Production',
                  data: capex,
                  backgroundColor: 'rgba(126, 158, 123, 1)'
              },
              {
                  label: 'Acquisitions',
                  data: acquisitions,
                  backgroundColor: 'rgba(132, 152, 191, 1)'
              }

          ]
      };
      var options = {
          responsive: true,
          maintainAspectRatio: true,
          legend: {
              display: true,
              position: 'bottom',
          },
          title: {
              display: false
          },
          animation: {
            duration: 0
          },
          scales: {
              xAxes: [
                  {
                      gridLines: {
                          display:false
                      },
                      ticks: {
                          display: true,
                          beginAtZero: true
                      }
                  }
              ],
              yAxes: [
                  {
                      stacked: true,
                      gridLines: {
                          drawBorder: false,
                          display:false
                      },
                      ticks: {
                          display: false,
                          min: 0,
                          max: 100
                      }
                  }
              ]
          }
      };
      var chart = new Chart(ctx, {
          type: 'line',
          data,
          options
      });
      this.charts.push(chart);
  }

  reset() {
    if (!this) {
      return;
    }

    this.ticker = '';
    this.company = {
      fundamentals: [],
      profile: {},
      prices: {}
    };
    this.charts.forEach(chart => {
        chart.destroy();
    });
  }
}